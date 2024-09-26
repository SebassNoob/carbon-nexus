import { Injectable } from "@nestjs/common";
import { generateIdFromEntropySize } from "lucia";
import { generateState, Discord, Google, type DiscordTokens } from "arctic";
import type { SafeUser, SessionCookie } from "@shared/common/types";
import { OpenAuthCallbackSchema, SessionIdSchema } from "@shared/common/schemas";
import { validateSchema } from "@utils/validateSchema";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { PrismaService, LuciaService } from "@db/client";
import { ConfigService } from "@nestjs/config";
import type { DiscordUser, InitOAuthData } from "./types";
import { DiscordUserSchema } from "./constants";

@Injectable()
export class OpenAuthService {
	private discord!: Discord;

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
	}
	private generateUserId(): string {
		return generateIdFromEntropySize(10);
	}

	async getDiscordAuthUrl(): Promise<InitOAuthData> {
		const state = generateState();
		const url = await this.discord.createAuthorizationURL(state, {
			scopes: ["identify", "email"],
		});
		return { state, url: url.toString() };
	}

	async handleDiscordCallback(
		code: string | undefined,
		state: string | undefined,
	): Promise<SessionCookie> {
		if (code === undefined || state === undefined) {
			throw new AppError(AppErrorTypes.GenericError("Missing code or state from OAuth provider"));
		}

		let tokens: DiscordTokens;
		try {
			tokens = await this.discord.validateAuthorizationCode(code);
		} catch (error) {
			throw new AppError(AppErrorTypes.GenericError("Failed to validate authorization code"));
		}

		// get user info from discord
		let discordUser: DiscordUser;
		try {
			const response = await fetch("https://discord.com/api/users/@me", {
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`,
				},
			});
			const _discordUser = await response.json();
			// validate user info
			discordUser = validateSchema(DiscordUserSchema, _discordUser);
		} catch (error) {
			throw new AppError(
				AppErrorTypes.GenericError("Failed to fetch user info from OAuth provider"),
			);
		}

		// get or create user
		const account = await this.prisma.oAuthAccount.findFirst({
			where: {
				providerId: "discord" as const,
				providerUserId: discordUser.id,
			},
			include: {
				user: true,
			},
		});

		if (account) {
			const session = await this.lucia.createSession(account.user.id, {});
			const sessionCookie = this.lucia.createSessionCookie(session.id);
			return {
				id: sessionCookie.value,
				expiresAt: session.expiresAt,
			};
		}

		// no oauth account found, find if user exists

		const user = await this.prisma.user.findFirst({
			where: {
				email: discordUser.email,
			},
		});

		// if user exists, create oauth account and session. link user to oauth account
		if (user) {
			try {
				await this.prisma.oAuthAccount.create({
					data: {
						providerId: "discord" as const,
						providerUserId: discordUser.id,
						userId: user.id,
					},
				});
			} catch (error) {
				handleDatabaseError(error);
			}

			const session = await this.lucia.createSession(user.id, {});
			const sessionCookie = this.lucia.createSessionCookie(session.id);

			return {
				id: sessionCookie.value,
				expiresAt: session.expiresAt,
			};
		}

		// create new user, oauth account, and session

		try {
			const userId = this.generateUserId();

			await this.prisma.user.create({
				data: {
					id: userId,
					username: discordUser.username,
					email: discordUser.email,
				},
			});

			await this.prisma.oAuthAccount.create({
				data: {
					providerId: "discord" as const,
					providerUserId: discordUser.id,
					userId: userId,
				},
			});

			const session = await this.lucia.createSession(userId, {});
			const sessionCookie = this.lucia.createSessionCookie(session.id);

			return {
				id: sessionCookie.value,
				expiresAt: session.expiresAt,
			};
		} catch (error) {
			handleDatabaseError(error);
		}
	}
}
