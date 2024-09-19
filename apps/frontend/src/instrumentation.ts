import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
	if (process.env.NODE_ENV === "production" && process.env.NEXT_RUNTIME !== "edge") {
		await import("@shared/logger")
			.then((mod) => mod.default)
			.then((logger) => {
				logger.error({
					error,
					request,
					context,
				});
			});
	}
};
