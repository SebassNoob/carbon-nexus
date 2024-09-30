import { Controller, Get, Body, Post, HttpCode, Res, Delete, Param, Req } from "@nestjs/common";
import type { Response, Request } from "express";
import type { SignInInput, SignUpInput } from "@shared/common/types";
import { sessionCookieName } from "@shared/common/constants";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
	) {}

	@Post("signup")
	@HttpCode(201)
	async signUp(@Body() input: SignUpInput, @Res({ passthrough: true }) res: Response) {
		const sessionCookie = await this.authService.signUp(input);
		res.cookie(sessionCookieName, sessionCookie.id, {
			expires: sessionCookie.expiresAt,
			httpOnly: true,
			secure: this.configService.get<string>("NODE_ENV") === "production",
			sameSite: "lax",
		});
		return {};
	}

	@Post("signin")
	@HttpCode(201)
	async signIn(@Body() input: SignInInput, @Res({ passthrough: true }) res: Response) {
		const sessionCookie = await this.authService.signIn(input);
		res.cookie(sessionCookieName, sessionCookie.id, {
			expires: sessionCookie.expiresAt,
			httpOnly: true,
			secure: this.configService.get<string>("NODE_ENV") === "production",
			sameSite: "lax",
		});
		return {};
	}

	@Delete("signout/:sessionId")
	@HttpCode(204)
	async signOut(@Param("sessionId") sessionId: string) {
		this.authService.signOut({ sessionId });
		return {};
	}

	@Get("me")
	async user(@Req() req: Request) {
		const sessionId = req.cookies[sessionCookieName] as string | undefined;
		return this.authService.getUserFromSession({ sessionId });
	}
}
