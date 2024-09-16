import { Controller, Get, Body, Post, HttpCode, Res, Query, Delete, Param } from "@nestjs/common";
import type { Response, Request } from "express";
import type { SignInInput, SignUpInput } from "@shared/common/types";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("signup")
	@HttpCode(201)
	async signUp(@Body() input: SignUpInput, @Res({ passthrough: true }) res: Response) {
		const sessionCookie = await this.authService.signUp(input);
		res.cookie("sessionId", sessionCookie.id, {
			expires: sessionCookie.expiresAt,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});
		return {};
	}

	@Post("signin")
	@HttpCode(201)
	async signIn(@Body() input: SignInInput, @Res({ passthrough: true }) res: Response) {
		const sessionCookie = await this.authService.signIn(input);
		res.cookie("sessionId", sessionCookie.id, {
			expires: sessionCookie.expiresAt,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});
		return {};
	}

	@Delete("signout/:sessionId")
	@HttpCode(204)
	async signOut(@Param("sessionId") sessionId: string) {
		this.authService.signOut({sessionId});
		return {};
	}

	@Get("user")
	async user(@Query("sessionId") sessionId: string) {
		return this.authService.getUserFromSession({ sessionId });
	}
}
