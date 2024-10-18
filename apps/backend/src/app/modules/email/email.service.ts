import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@db/client";
import { AppError, AppErrorTypes } from "@utils/appErrors";
import { createTransport, type Transporter } from "nodemailer";
import { compile } from "handlebars";
import { readdirSync, readFileSync } from "fs";
import { randomBytes } from "crypto";

@Injectable()
export class EmailService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService,
	) {}

	private transporter!: Transporter;
	private emailFrom!: string;
	private emailTemplates!: Record<string, HandlebarsTemplateDelegate>;

	private compileTemplatesFromDir(dir: string) {
		const templates = readdirSync(dir);
		return templates.reduce(
			(acc, template) => {
				const templatePath = `${dir}/${template}`;
				const templateContent = readFileSync(templatePath, "utf-8");
				const compiledTemplate = compile(templateContent);
				return {
					...acc,
					[template]: compiledTemplate,
				};
			},
			{} as Record<string, HandlebarsTemplateDelegate>,
		);
	}

	onModuleInit() {
		this.transporter = createTransport({
			host: this.config.get<string>("EMAIL_HOST"),
			port: this.config.get<number>("EMAIL_PORT"),
			secure: this.config.get<boolean>("EMAIL_SECURE"),
			auth: {
				user: this.config.get<string>("EMAIL_USER"),
				pass: this.config.get<string>("EMAIL_PASSWORD"),
			},
		});
		this.emailFrom = this.config.get<string>("EMAIL_USER") ?? "";

		this.emailTemplates = this.compileTemplatesFromDir(`${__dirname}/templates`);
	}

	private async sendEmail(
		to: string,
		subject: string,
		template: string,
		context: Record<string, unknown>,
	) {
		if (!this.emailTemplates[template]) {
			throw new AppError(AppErrorTypes.Panic(`Email template ${template} not found`));
		}
		const html = this.emailTemplates[template](context);
		await this.transporter.sendMail({
			from: this.emailFrom,
			to,
			subject,
			html,
		});
	}

	async sendForgotPasswordEmail(email: string) {
		// in this case, it doesnt matter if password hash exists or not
		// users who have not set a password yet can still reset their password
		// users without an email address cannot reset their password
		const user = await this.prisma.user.findUnique({ where: { email } });
		if (!user) {
			throw new AppError(AppErrorTypes.UserNotFound);
		}

		// find any existing password reset token and delete it

		try {
			await this.prisma.passwordResetToken.delete({
				where: {
					userId: user.id,
				},
			});
		} catch (error) {
			// ignore if token does not exist
		}

		// create a new password reset token

		const token = await this.prisma.passwordResetToken.create({
			data: {
				userId: user.id,
				token: randomBytes(32).toString("hex"),
				expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
			},
		});

		// send email
		await this.sendEmail(email, "Reset your password", "forgotPassword.hbs", {
			username: user.username,
			url: `${this.config.get<string>("FRONTEND_URL")}/reset-password/${token.token}`,
		});
	}
}