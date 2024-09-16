"use server";

import { cookies } from "next/headers";
import { query } from "@utils";
import type { SafeUser } from "@shared/common/types";

export async function getUser() {
	const cookieStore = cookies();
	const sessionCookie = cookieStore.get("sessionId")?.value;

	const { status, data } = await query<SafeUser>(`/auth/user?sessionId=${sessionCookie}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return {
		status,
		data,
	};
}
