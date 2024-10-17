import type {
	Prettify,
	ErrorResponse,
	Serialized,
	SerializedResponsePayload,
} from "@shared/common/types";

export type QueryResult<T> = {
	status: number;
	data: Prettify<Serialized<T>> | null;
	error: Prettify<ErrorResponse> | null;
	headers: Headers;
	timeStamp: string;
};

export async function query<T>(input: string, init?: RequestInit): Promise<QueryResult<T>> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const url = input.startsWith("/") ? baseURL + input : input;
	return fetch(url, {
		...init,
		credentials: "include",
		headers: {
			"content-type": "application/json",
			...init?.headers,
		},
	}).then(async (res) => {
		try {
			const body: Prettify<SerializedResponsePayload<T>> = await res.json();
			return {
				status: res.status,
				data: body.success ? body.data : null,
				error: body.success ? null : body.error,
				headers: res.headers,
				timeStamp: body.timestamp,
			};
		} catch (error) {
			return {
				status: res.status,
				data: null,
				error: { path: url, name: "Failed to parse response", cause: error },
				headers: res.headers,
				timeStamp: new Date().toISOString(),
			};
		}
	});
}
