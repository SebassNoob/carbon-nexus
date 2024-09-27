import { Injectable } from "@nestjs/common";
import { generateIdFromEntropySize } from "lucia";
import {
	generateState,
	generateCodeVerifier,
	Discord,
	Google,
	type DiscordTokens,
	type GoogleTokens,
} from "arctic";
import type { SessionCookie } from "@shared/common/types";
import { validateSchema } from "@utils/validateSchema";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { PrismaService, LuciaService } from "@db/client";
import { ConfigService } from "@nestjs/config";
import type { DiscordUser, GoogleUser, InitOAuthData, OAuthUser, OAuthProvider } from "./types";
import { DiscordUserSchema, GoogleUserSchema } from "./constants";
import type { z } from "zod";

@Injectable()
export class OpenAuthService {
	private discord!: Discord;
	private google!: Google;

	constructor(
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService,
		private readonly lucia: LuciaService,
	) {}

	onModuleInit() {
		this.discord = new Discord(
			this.configService.get<string>("DISCORD_OAUTH_CLIENT_ID") as string,
			this.configService.get<string>("DISCORD_OAUTH_CLIENT_SECRET") as string,
			this.configService.get<string>("DISCORD_OAUTH_REDIRECT_URI") as string,
		);
		this.google = new Google(
			this.configService.get<string>("GOOGLE_OAUTH_CLIENT_ID") as string,
			this.configService.get<string>("GOOGLE_OAUTH_CLIENT_SECRET") as string,
			this.configService.get<string>("GOOGLE_OAUTH_REDIRECT_URI") as string,
		);
	}

	private async fetchUserDataFromOAuthProvider<T>(
		url: string,
		headers: Record<string, string>,
		schema: z.ZodType<T>,
	): Promise<T> {
		try {
			const response = await fetch(url, {
				headers,
			});
			const data = await response.json();
			return validateSchema(schema, data);
		} catch {
			throw new AppError(
				AppErrorTypes.GenericError("Failed to fetch user info from OAuth provider"),
			);
		}
	}

	private generateUserId(): string {
		return generateIdFromEntropySize(10);
	}

	private async makeSessionCookie(userId: string): Promise<SessionCookie> {
		const session = await this.lucia.createSession(userId, {});
		const sessionCookie = this.lucia.createSessionCookie(session.id);
		return {
			id: sessionCookie.value,
			expiresAt: session.expiresAt,
		};
	}

	private async handleOAuth(
		provider: OAuthProvider,
		{ id, email, username }: OAuthUser,
	): Promise<SessionCookie> {
		// check if oauth account exists
		const oAuthAccount = await this.prisma.oAuthAccount.findFirst({
			where: {
				providerId: provider,
				providerUserId: id,
			},
			include: {
				user: true,
			},
		});

		// if oauth account exists, create session and return session cookie (sign in)
		if (oAuthAccount) return await this.makeSessionCookie(oAuthAccount.user.id);

		// if oauth account does not exist, check if user exists
		const user = await this.prisma.user.findFirst({
			where: {
				email,
			},
		});

		// if user exists, create oauth account and session. link user to oauth account
		if (user) {
			try {
				await this.prisma.oAuthAccount.create({
					data: {
						providerId: provider,
						providerUserId: id,
						userId: user.id,
					},
				});
			} catch (error) {
				handleDatabaseError(error);
			}

			return await this.makeSessionCookie(user.id);
		}

		// if user does not exist, create new user, oauth account, and session

		try {
			const userId = this.generateUserId();

			await this.prisma.user.create({
				data: {
					id: userId,
					username,
					email,
				},
			});

			await this.prisma.oAuthAccount.create({
				data: {
					providerId: provider,
					providerUserId: id,
					userId,
				},
			});

			return await this.makeSessionCookie(userId);
		} catch (error) {
			handleDatabaseError(error);
		}
	}

	async getDiscordAuthUrl(): Promise<InitOAuthData> {
		const state = generateState();
		const url = await this.discord.createAuthorizationURL(state, {
			scopes: ["identify", "email"],
		});
		return { state, url: url.toString() };
	}

	async getGoogleAuthUrl(): Promise<Required<InitOAuthData>> {
		const state = generateState();
		const codeVerifier = generateCodeVerifier();
		const url = await this.google.createAuthorizationURL(state, codeVerifier, {
			scopes: ["profile", "email"],
		});
		return { state, codeVerifier, url: url.toString() };
	}

	async handleDiscordCallback(code: string | undefined): Promise<SessionCookie> {
		if (code === undefined) {
			throw new AppError(AppErrorTypes.GenericError("Missing code from OAuth provider"));
		}

		let tokens: DiscordTokens;
		try {
			tokens = await this.discord.validateAuthorizationCode(code);
		} catch (error) {
			throw new AppError(AppErrorTypes.GenericError("Failed to validate authorization code"));
		}

		// get user info from discord
		const discordUser = await this.fetchUserDataFromOAuthProvider<DiscordUser>(
			"https://discord.com/api/users/@me",
			{
				Authorization: `Bearer ${tokens.accessToken}`,
			},
			DiscordUserSchema,
		);

		return await this.handleOAuth("discord", discordUser);
	}

	async handleGoogleCallback(
		code: string | undefined,
		codeVerifier: string | undefined,
	): Promise<SessionCookie> {
		if (code === undefined || codeVerifier === undefined) {
			throw new AppError(
				AppErrorTypes.GenericError("Missing code or codeVerifier from OAuth provider"),
			);
		}

		let tokens: GoogleTokens;
		try {
			tokens = await this.google.validateAuthorizationCode(code, codeVerifier);
		} catch (error) {
			throw new AppError(AppErrorTypes.GenericError("Failed to validate authorization code"));
		}

		// get user info from google
		const googleUser = await this.fetchUserDataFromOAuthProvider<GoogleUser>(
			"https://openidconnect.googleapis.com/v1/userinfo",
			{
				Authorization: `Bearer ${tokens.accessToken}`,
			},
			GoogleUserSchema,
		);

		return await this.handleOAuth("google", {
			id: googleUser.sub,
			email: googleUser.email,
			username: googleUser.name,
		});
	}
}
