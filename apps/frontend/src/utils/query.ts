import type { Prettify } from "@utils";
type Serialized<T> = Record<keyof T, string>;

export type QueryResult<T> = {
	status: number;
	data: Prettify<Serialized<T>> | null;
};

export async function query<T>(input: string, init?: RequestInit): Promise<QueryResult<T>> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const url = input.startsWith("/") ? baseURL + input : input;
	return fetch(url, { ...init, credentials: "include" }).then(async (res) => {
		try {
			const data = await res.json();
			return { status: res.status, data };
		} catch (error) {
			return { status: res.status, data: null };
		}
	});
}
