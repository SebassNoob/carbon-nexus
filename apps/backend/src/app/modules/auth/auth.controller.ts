import { Controller, Get, Body, Post, HttpCode, Res, Query, Delete, Param } from "@nestjs/common";
import type { Response } from "express";
import type { SignInInput, SignUpInput } from "@shared/common/types";
import { ConfigService } from "@nestjs/config";
import { PasswordAuthService } from "./passwordAuth.service";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly configService: ConfigService,
		private readonly passwordAuthService: PasswordAuthService,
	) {}

	@Post("signup")
	@HttpCode(201)
	async signUp(@Body() input: SignUpInput, @Res({ passthrough: true }) res: Response) {
		const sessionCookie = await this.passwordAuthService.signUp(input);
		res.cookie("sessionId", sessionCookie.id, {
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
		const sessionCookie = await this.passwordAuthService.signIn(input);
		res.cookie("sessionId", sessionCookie.id, {
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
		this.passwordAuthService.signOut({ sessionId });
		return {};
	}

	@Get("user")
	async user(@Query("sessionId") sessionId: string) {
		return this.passwordAuthService.getUserFromSession({ sessionId });
	}
}
