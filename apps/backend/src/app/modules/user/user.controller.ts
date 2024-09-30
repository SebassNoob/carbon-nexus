import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async getUserById(@Query("id") id: string) {
		return this.userService.getUserById({ id });
	}

	@Patch(":id")
	async updateUserById(@Param("id") id: string, @Body() data: Body) {
		return this.userService.updateUserById(id, data);
	}
}
