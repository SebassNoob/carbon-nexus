import {
	Controller,
	Get,
	Body,
	Post,
	HttpCode,
	Res,
	Query,
	Delete,
	Param,
	Req,
} from "@nestjs/common";
import type { Response, Request } from "express";
import { ConfigService } from "@nestjs/config";
import { OpenAuthService } from "./oauth.service";
import { oAuthCookieNames, sessionCookieName } from "@shared/common/constants";
import { AppError, AppErrorTypes } from "@utils/appErrors";

@Controller("oauth")
export class OpenAuthController {
	constructor(
		private readonly configService: ConfigService,
		private readonly openAuthService: OpenAuthService,
	) {}

	@Get(":provider")
	async getAuthUrl(@Param("provider") provider: string, @Res({ passthrough: true }) res: Response) {
		switch (provider) {
			case "discord": {
				const { url, state } = await this.openAuthService.getDiscordAuthUrl();
				res.cookie(oAuthCookieNames.discord.state, state, {
					httpOnly: true,
					secure: this.configService.get<string>("NODE_ENV") === "production",
					sameSite: "lax",
					expires: new Date(Date.now() + 1000 * 60 * 5),
				});
				return { url };
			}

			default:
				return {};
		}
	}

	@Get("callback/:provider")
	async callback(
		@Param("provider") provider: string,
		@Query("code") code: string | undefined,
		@Query("state") state: string | undefined,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		switch (provider) {
			case "discord": {
				const stateCookie = req.cookies[oAuthCookieNames.discord.state];
				if (!stateCookie) {
					throw new AppError(AppErrorTypes.InvalidState);
				}

				res.clearCookie(oAuthCookieNames.discord.state);
				if (stateCookie !== state) {
					throw new AppError(AppErrorTypes.InvalidState);
				}
				const { expiresAt, id } = await this.openAuthService.handleDiscordCallback(code, state);

				res.cookie(sessionCookieName, id, {
					httpOnly: true,
					secure: this.configService.get<string>("NODE_ENV") === "production",
					sameSite: "lax",
					expires: expiresAt,
				});
				return res.redirect(this.configService.get<string>("FRONTEND_URL") as string);
			}
			default:
				return {};
		}
	}
}
