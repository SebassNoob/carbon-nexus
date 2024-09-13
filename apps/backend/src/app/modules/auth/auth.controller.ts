import { Controller, Get, Body, Post, HttpCode, Res, Req, Delete } from "@nestjs/common";
import type { Response } from "express";
import type { SignInInput, SignUpInput } from "@shared/common/types";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("signup")
	async signUp(@Body() input: SignUpInput, @Res({ passthrough: true }) res: Response) {
		const sessionCookie = await this.authService.signUp(input);
		res.cookie("session", sessionCookie.id, {
			expires: sessionCookie.expiresAt,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});
	}

	@Post("signin")
	@HttpCode(200)
	async signIn(@Body() input: SignInInput, @Res({ passthrough: true }) res: Response) {
		const sessionCookie = await this.authService.signIn(input);
		res.cookie("session", sessionCookie.id, {
			expires: sessionCookie.expiresAt,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});
	}

	@Delete("signout")
	async signOut(@Body() input: { sessionId: string }) {
		this.authService.signOut(input);
	}
}
