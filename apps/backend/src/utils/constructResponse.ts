import type { ResponsePayload, ErrorResponse } from "@shared/common/types";

type ConstructResponseData = {
	data?: Record<string, unknown>;
	error?: ErrorResponse;
};

export function constructResponse({
	data,
	error,
}: ConstructResponseData): ResponsePayload<unknown> {
	return {
		success: !error,
		data: data ?? null,
		error: error ?? null,
		timestamp: new Date().toISOString(),
	};
}
