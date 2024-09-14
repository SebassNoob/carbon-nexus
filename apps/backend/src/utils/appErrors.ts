import { HttpException } from "@nestjs/common";

export class AppError extends HttpException {
	constructor(error: AppErrorType) {
		super(error.name, error.code, { cause: error.cause });
	}
}

interface AppErrorType {
	name: string;
	code: number;
	cause: string | Record<string, unknown>;
}

export const AppErrorTypes = {
	Panic: (cause: string) => ({
		name: "Panic",
		code: 500,
		cause,
	}),
	FormValidationError: (cause: Record<string, unknown>) => ({
		name: "FormValidationError",
		code: 400,
		cause,
	}),
	DatabaseError: (name: string, code: number, cause: string) => ({
		name,
		code,
		cause,
	}),
	InvalidCredentials: {
		name: "InvalidCredentials",
		code: 403,
		cause: "Invalid username or password",
	},
	UserNotFound: {
		name: "UserNotFound",
		code: 404,
		cause: "User not found",
	},
	Unauthorized: {
		name: "Unauthorized",
		code: 401,
		cause: "Unauthorized",
	},
	ResouceExists: {
		name: "ResourceExists",
		code: 409,
		cause: "Resource already exists",
	},
	GenericError: (cause: string) => ({
		name: "GenericError",
		code: 500,
		cause,
	}),
} as const satisfies Record<string, ((...args: any[]) => AppErrorType) | AppErrorType>;
