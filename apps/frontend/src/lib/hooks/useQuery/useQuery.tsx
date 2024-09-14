import useSWR from "swr";
import { query } from "@utils/query";
import type { SWRConfiguration, BareFetcher } from "swr";

export function useQuery<T>(
	url: string,
	options?: SWRConfiguration<[number, T], any, BareFetcher<[number, T]>>,
) {
	return useSWR<[number, T]>(url, query, options);
}
