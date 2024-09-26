"use server";

import { cookies } from "next/headers";
import { query } from "@utils";
import { sessionCookieName } from "@shared/common/constants";

export async function signOut() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(sessionCookieName)?.value;

	const { status } = await query<void>(`/auth/signout/${sessionCookie}`, {
		method: "DELETE",
	});

	if (status === 204) {
		cookieStore.delete(sessionCookieName);
	}

	return {
		status,
	};
}
