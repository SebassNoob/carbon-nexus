"use server";

import { cookies } from "next/headers";
import { query } from "@utils";
import type { SafeUser } from "@shared/common/types";
import { sessionCookieName } from "@shared/common/constants";

export async function getUser() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(sessionCookieName)?.value;

	const { status, data } = await query<SafeUser>("/auth/me", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Cookie: `${sessionCookieName}=${sessionCookie}`,
		},
	});

	return {
		status,
		data,
		tokenId: sessionCookie,
	};
}
