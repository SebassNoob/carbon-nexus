export async function query<T>(input: string, init?: RequestInit): Promise<[number, T]> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const url = input.startsWith("/") ? baseURL + input : input;
	return fetch(url, { ...init, credentials: "include" }).then(async (res) => {
		try {
			const data = await res.json();
			return [res.status, data];
		} catch (error) {
			return [res.status, null];
		}
	});
}
