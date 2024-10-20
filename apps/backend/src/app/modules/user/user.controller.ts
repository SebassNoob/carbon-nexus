import { Body, Controller, Get, Param, Patch, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@guards";
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
	@UseGuards(AuthGuard("params", "id"))
	async updateUserById(
		@Param("id", new ValidationPipe(GetUserInputSchema)) id: string,
		@Body(new ValidationPipe(UpdateUserInputSchema)) data: UpdateUserInput,
		@Req() req: Request,
	) {
		return this.userService.updateUserById(id, data);
	}
}
