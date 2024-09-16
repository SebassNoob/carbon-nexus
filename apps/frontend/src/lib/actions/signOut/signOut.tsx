"use server";

import { cookies } from "next/headers";
import { query } from "@utils";

export async function signOut() {
	const cookieStore = cookies();
	const sessionCookie = cookieStore.get("sessionId")?.value;

	const { status } = await query<void>(`/auth/signout/${sessionCookie}`, {
		method: "DELETE",
	});

	if (status === 204) {
		cookieStore.delete("sessionId");
	}

	return {
		status,
	};
}
