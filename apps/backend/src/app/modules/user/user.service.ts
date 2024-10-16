import { Injectable } from "@nestjs/common";
import { PrismaService } from "@db/client";
import type { SafeUser, UpdateUserInput } from "@shared/common/types";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async getUserById(id: string): Promise<SafeUser> {
		let user: SafeUser | null = null;
		try {
			user = await this.prisma.user.findUnique({
				where: {
					id,
				},
				select: {
					id: true,
					username: true,
					email: true,
					createdAt: true,
					verified: true,
					theme: true,
					reducedMotion: true,
					timezone: true,
				},
			});
		} catch (error: unknown) {
			handleDatabaseError(error);
		}
		if (user === null) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}
		return user;
	}

	async updateUserById(id: string, data: UpdateUserInput): Promise<SafeUser> {
		let user: SafeUser | null = null;
		try {
			user = await this.prisma.user.update({
				where: { id },
				data,
				select: {
					id: true,
					username: true,
					email: true,
					createdAt: true,
					verified: true,
					theme: true,
					reducedMotion: true,
					timezone: true,
				},
			});
		} catch (error: unknown) {
			handleDatabaseError(error);
		}
		return user;
	}
}
