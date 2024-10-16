import { Catch, type ExceptionFilter, type ArgumentsHost } from "@nestjs/common";
import type { Request, Response } from "express";
import { AppError } from "@utils/appErrors";
import logger from "@shared/logger";

@Catch(AppError)
export class AppErrorFilter implements ExceptionFilter {
	catch(exception: AppError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		if (process.env.NODE_ENV === "production")
			logger.error({
				host,
				error: {
					code: exception.code,
					name: exception.name,
					message: exception.message,
					stack: exception.stack,
				},
				request: {
					url: request.url,
					method: request.method,
					headers: request.headers,
					body: request.body,
					query: request.query,
					ips: request.ips,
					hostname: request.hostname,
					protocol: request.protocol,
					secure: request.secure,
				},
				response: {
					headers: response.getHeaders(),
					statusCode: response.statusCode,
					statusMessage: response.statusMessage,
				},
			});

		response.status(status).json({
			timestamp: new Date().toISOString(),
			path: request.url,
			name: exception.message,
			cause: exception.cause,
		});
	}
}
