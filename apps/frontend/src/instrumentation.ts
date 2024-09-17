import type { Instrumentation } from "next";
import logger from "@shared/logger";

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
	if (process.env.NODE_ENV === "production" && process.env.NEXT_RUNTIME === "node") {
		logger.error({
			error,
			request,
			context,
		});
	}
};
