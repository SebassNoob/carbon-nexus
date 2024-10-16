import { Body, Controller, Get, Param, Patch, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import { sessionCookieName } from "@shared/common/constants";
import { UserService } from "./user.service";
import { ValidationPipe } from "@pipes";
import { GetUserInputSchema, UpdateUserInputSchema } from "@shared/common/schemas";
import type { UpdateUserInput } from "@shared/common/types";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async getUserById(@Query("id", new ValidationPipe(GetUserInputSchema)) id: string) {
		return this.userService.getUserById(id);
	}

	@Patch(":id")
	async updateUserById(
		@Param("id", new ValidationPipe(GetUserInputSchema)) id: string,
		@Body(new ValidationPipe(UpdateUserInputSchema)) data: UpdateUserInput,
		@Req() req: Request,
	) {
		// const token = req.cookies[sessionCookieName] as string | undefined;

		return this.userService.updateUserById(id, data);
	}
}
