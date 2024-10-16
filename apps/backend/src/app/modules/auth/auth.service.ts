import { Injectable } from "@nestjs/common";
import { password as bunPassword } from "bun";
import type { SafeUser, SignInInput, TokenCookie, SignUpInput } from "@shared/common/types";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { PrismaService, LuciaService } from "@db/client";

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly lucia: LuciaService,
	) {}

	private hashPassword(password: string): Promise<string> {
		return bunPassword.hash(password, {
			algorithm: "argon2id",
			memoryCost: 2 ** 12,
			timeCost: 2,
		});
	}

	async signUp(data: SignUpInput): Promise<TokenCookie> {
		const passwordHash = await this.hashPassword(data.password);
		try {
			const user = await this.prisma.user.create({
				data: {
					id: this.lucia.generateUserId(),
					username: data.username,
					email: data.email,
					passwordHash,
				},
			});

			const token = this.lucia.generateSessionToken();
			const session = await this.lucia.createSession(token, user.id);

			return {
				value: token,
				expiresAt: session.expiresAt,
			};
		} catch (error: unknown) {
			handleDatabaseError(error);
		}
	}

	async signIn(data: SignInInput): Promise<TokenCookie> {
		const user = await this.prisma.user.findFirst({
			where: {
				email: data.email,
			},
		});

		if (!user) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}

		// no password -- used oauth
		if (user.passwordHash === null) {
			throw new AppError(AppErrorTypes.InvalidCredentials);
		}

		const isValidPassword = await bunPassword.verify(data.password, user.passwordHash);

		if (!isValidPassword) {
			throw new AppError(AppErrorTypes.InvalidCredentials);
		}

		const token = this.lucia.generateSessionToken();
		const session = await this.lucia.createSession(token, user.id);

		return {
			value: token,
			expiresAt: session.expiresAt,
		};
	}

	async signOut(tokenId: string): Promise<void> {
		const { session } = await this.lucia.validateSessionToken(tokenId);
		if (!session) throw new AppError(AppErrorTypes.InvalidToken);

		await this.lucia.invalidateSession(session.id);
	}

	async getUserFromSession(tokenId: string | undefined): Promise<SafeUser> {
		if (!tokenId) {
			throw new AppError(AppErrorTypes.InvalidToken);
		}

		const { session, user } = await this.lucia.validateSessionToken(tokenId);

		if (!session || !user) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}
		return user;
	}
}
