import type { Prettify, Serialized } from "@shared/common/types";

export type QueryResult<T> = {
	status: number;
	body: Prettify<Serialized<T>> | null;
	headers: Headers;
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
			const body = await res.json();
			return { status: res.status, body, headers: res.headers };
		} catch (error) {
			return { status: res.status, body: null, headers: res.headers };
		}
	});
}
