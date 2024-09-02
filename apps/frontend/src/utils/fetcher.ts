export async function appFetch(...args: Parameters<typeof fetch>) {
	return fetch(...args).then((res) => res.json());
}
