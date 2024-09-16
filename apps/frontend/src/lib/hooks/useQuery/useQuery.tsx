"use client";
import useSWR from "swr";
import { query, type QueryResult } from "@utils/query";
import type { SWRConfiguration, BareFetcher } from "swr";

export function useQuery<T>(url: string, options?: Parameters<typeof useSWR<QueryResult<T>>>[2]) {
	return useSWR<QueryResult<T>>(url, query, options);
}
