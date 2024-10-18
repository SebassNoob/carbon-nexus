import { Controller, Post, Body, HttpCode } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ValidationPipe } from "@pipes";
import { ForgotPasswordEmailSchema } from "@shared/common/schemas";
import type { ForgotPasswordEmail } from "@shared/common/types";

@Controller("email")
export class EmailController {
	constructor(private readonly emailService: EmailService) {}

	@Post("forgot-password")
	@HttpCode(201)
	async sendForgotPasswordEmail(
		@Body(new ValidationPipe(ForgotPasswordEmailSchema)) { email }: ForgotPasswordEmail,
	) {
		await this.emailService.sendForgotPasswordEmail(email);
		return {};
	}
}
