import { Injectable } from "@nestjs/common";
import { password as bunPassword } from "bun";
import type {
	SafeUser,
	SignInInput,
	TokenCookie,
	SignUpInput,
	ForgotPasswordReset,
} from "@shared/common/types";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { PrismaService, LuciaService } from "@db/client";
import { UserService } from "@modules/user";

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly lucia: LuciaService,
		private readonly userService: UserService,
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
		return this.userService.getUserById(user.id);
	}

	async resetPassword(data: ForgotPasswordReset): Promise<void> {
		// find reset password token if it exists
		const token = await this.prisma.passwordResetToken.findFirst({
			where: {
				token: data.token,
				expiresAt: {
					gte: new Date(),
				},
			},
			select: {
				userId: true,
			},
		});

		if (!token) {
			throw new AppError(AppErrorTypes.InvalidToken);
		}

		const passwordHash = await this.hashPassword(data.newPassword);

		await this.prisma.user.update({
			where: {
				id: token.userId,
			},
			data: {
				passwordHash,
			},
		});

		// delete the token
		await this.prisma.passwordResetToken.delete({
			where: {
				token: data.token,
			},
		});
	}

	async verifyEmail(token: string): Promise<void> {
		const emailVerificationToken = await this.prisma.verificationToken.findFirst({
			where: {
				token,
				expiresAt: {
					gte: new Date(),
				},
			},
			select: {
				userId: true,
			},
		});

		if (!emailVerificationToken) {
			throw new AppError(AppErrorTypes.InvalidToken);
		}

		await this.prisma.user.update({
			where: {
				id: emailVerificationToken.userId,
			},
			data: {
				verified: true,
			},
		});

		await this.prisma.verificationToken.delete({
			where: {
				token,
			},
		});
	}
}
