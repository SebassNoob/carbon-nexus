import { Controller, Get, Body, Post, HttpCode, Res, Delete, Param, Req } from "@nestjs/common";
import type { Response, Request } from "express";
import type { SignInInput, SignUpInput } from "@shared/common/types";
import { sessionCookieName } from "@shared/common/constants";
import { AuthService } from "./auth.service";
import { LuciaService } from "@db/client";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly luciaService: LuciaService,
	) {}

	@Post("signup")
	@HttpCode(201)
	async signUp(@Body() input: SignUpInput, @Res({ passthrough: true }) res: Response) {
		const tokenCookie = await this.authService.signUp(input);
		this.luciaService.setSessionCookie(res, sessionCookieName, tokenCookie);
		return {};
	}

	@Post("signin")
	@HttpCode(201)
	async signIn(@Body() input: SignInInput, @Res({ passthrough: true }) res: Response) {
		const tokenCookie = await this.authService.signIn(input);
		this.luciaService.setSessionCookie(res, sessionCookieName, tokenCookie);
		return {};
	}

	@Delete("signout/:tokenId")
	@HttpCode(204)
	async signOut(@Param("tokenId") tokenId: string) {
		this.authService.signOut({ tokenId });
		return {};
	}

	@Get("me")
	async user(@Req() req: Request) {
		const tokenId = req.cookies[sessionCookieName] as string | undefined;
		return this.authService.getUserFromSession({ tokenId });
	}
}
