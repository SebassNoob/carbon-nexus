import { Injectable } from "@nestjs/common";
import { PrismaService } from "@db/client";
import type { OAuthProvider, SafeUser, UpdateUserInput } from "@shared/common/types";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import type { Prisma, User } from "@prisma/client";

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	private rawUserFindFields = {
		id: true,
		username: true,
		email: true,
		createdAt: true,
		verified: true,
		theme: true,
		reducedMotion: true,
		timezone: true,
		passwordHash: true,
		oauthAccount: {
			select: {
				providerId: true,
			},
		},
	} as const;

	private cleanUserData(
		data: Prisma.UserGetPayload<{
			include: { oauthAccount: { select: { providerId: true } } };
		}>,
	): SafeUser {
		// find any oAuth providers that the user has connected
		const oAuthProviders = data.oauthAccount.map(
			(account) => account.providerId,
		) as OAuthProvider[];

		return {
			...data,
			oAuthProviders: oAuthProviders,
			hasPassword: !!data.passwordHash,
		};
	}

	async getUserById(id: string): Promise<SafeUser> {
		const rawUser = await this.prisma.user.findUnique({
			where: { id },
			select: this.rawUserFindFields,
		});
		if (!rawUser) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}

		return this.cleanUserData(rawUser);
	}

	async updateUserById(id: string, data: UpdateUserInput): Promise<SafeUser> {
		try {
			const rawUser = await this.prisma.user.update({
				where: { id },
				data,
				select: this.rawUserFindFields,
			});

			return this.cleanUserData(rawUser);
		} catch (error: unknown) {
			handleDatabaseError(error);
		}
	}
}
