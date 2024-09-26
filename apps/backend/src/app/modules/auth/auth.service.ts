import { Injectable } from "@nestjs/common";
import { generateIdFromEntropySize } from "lucia";
import { password as bunPassword } from "bun";
import type { SafeUser, SessionCookie } from "@shared/common/types";
import { SignUpInputSchema, SignInInputSchema, SessionIdSchema } from "@shared/common/schemas";
import { validateSchema } from "@utils/validateSchema";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { PrismaService, LuciaService } from "@db/client";

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly lucia: LuciaService,
	) {}
	private generateUserId(): string {
		return generateIdFromEntropySize(10);
	}

	private hashPassword(password: string): Promise<string> {
		return bunPassword.hash(password, {
			algorithm: "argon2id",
			memoryCost: 2 ** 12,
			timeCost: 2,
		});
	}

	async signUp(input: unknown): Promise<SessionCookie> {
		const data = validateSchema(SignUpInputSchema, input);

		const passwordHash = await this.hashPassword(data.password);
		try {
			const user = await this.prisma.user.create({
				data: {
					id: this.generateUserId(),
					username: data.username,
					email: data.email,
					passwordHash,
				},
			});

			const session = await this.lucia.createSession(user.id, {});

			const sessionCookie = this.lucia.createSessionCookie(session.id);

			return {
				id: sessionCookie.value,
				expiresAt: session.expiresAt,
			};
		} catch (error: unknown) {
			handleDatabaseError(error);
		}
	}

	async signIn(input: unknown): Promise<SessionCookie> {
		const data = validateSchema(SignInInputSchema, input);

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

		const session = await this.lucia.createSession(user.id, {});

		const sessionCookie = this.lucia.createSessionCookie(session.id);
		return {
			id: sessionCookie.value,
			expiresAt: session.expiresAt,
		};
	}

	async signOut(_sessionId: unknown): Promise<void> {
		const { sessionId } = validateSchema(SessionIdSchema, _sessionId);
		await this.lucia.invalidateSession(sessionId);
	}

	async getUserFromSession(_sessionId: unknown): Promise<SafeUser> {
		const { sessionId } = validateSchema(SessionIdSchema, _sessionId);
		const session = await this.prisma.session.findFirst({
			where: {
				id: sessionId,
			},
		});

		if (!session) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}

		const user = await this.prisma.user.findFirst({
			where: {
				id: session.userId,
			},
			select: {
				id: true,
				username: true,
				email: true,
				createdAt: true,
			},
		});

		if (!user) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}

		return user;
	}
}
