import { Injectable } from "@nestjs/common";
import { generateIdFromEntropySize } from "lucia";
import { generateState, Discord, Google } from "arctic";
import type { SafeUser, SessionCookie } from "@shared/common/types";
import { SignUpInputSchema, SignInInputSchema, SessionIdSchema } from "@shared/common/schemas";
import { validateSchema } from "@utils/validateSchema";
import { handleDatabaseError } from "@utils/prismaErrors";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { PrismaService, LuciaService } from "@db/client";
import { ConfigService } from "@nestjs/config";

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
			this.configService.get<string>("DISCORD_CLIENT_ID") as string,
			this.configService.get<string>("DISCORD_CLIENT_SECRET") as string,
			this.configService.get<string>("DISCORD_REDIRECT_URI") as string,
		);
	}
	private generateUserId(): string {
		return generateIdFromEntropySize(10);
	}
}
