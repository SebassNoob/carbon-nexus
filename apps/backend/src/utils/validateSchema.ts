import type { ZodTypeAny, z } from "zod";
import { AppError, AppErrorTypes } from "@utils/appErrors";

export function validateSchema<T extends ZodTypeAny>(schema: T, data: unknown) {
	const res = schema.safeParse(data);

	if (!res.success) {
		const flattened = res.error.flatten();

		const errors: Record<string, string[] | undefined> = {
			formErrors: flattened.formErrors.length !== 0 ? flattened.formErrors : undefined,
			...flattened.fieldErrors,
		};

		throw new AppError(AppErrorTypes.FormValidationError(errors));
	}

	return res.data as z.infer<typeof schema>;
}
