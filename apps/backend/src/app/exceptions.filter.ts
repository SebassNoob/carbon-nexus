import { Catch, type ExceptionFilter, type ArgumentsHost } from "@nestjs/common";
import type { Request, Response } from "express";
import { AppError } from "@utils/appErrors";

@Catch(AppError)
export class AppErrorFilter implements ExceptionFilter {
	catch(exception: AppError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		response.status(status).json({
			timestamp: new Date().toISOString(),
			path: request.url,
			name: exception.message,
			cause: exception.cause,
		});
	}
}
