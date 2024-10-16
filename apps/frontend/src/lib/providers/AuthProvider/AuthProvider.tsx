"use client";

import { useState, createContext, useEffect, useRef } from "react";
import type { AuthContextProps, AuthProviderProps } from "./types";
import type { SafeUser, Serialized } from "@shared/common/types";
import { signOut, getUser } from "@lib/actions";
import { query } from "@utils";
import dynamic from "next/dynamic";

export const AuthContext = createContext<AuthContextProps>({
	user: null,
	sessionId: null,
	loading: true,
	signOut: async () => false,
	updateUser: async () => {},
});

function unserializeUser(user: Serialized<SafeUser> | null): SafeUser | null {
	if (user === null) return null;
	return {
		...user,
		createdAt: new Date(user.createdAt),
	};
}

function _AuthProvider({ children }: AuthProviderProps) {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<SafeUser | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);

	// AbortController to cancel updateUser requests
	const updateUserAbortController = useRef<AbortController | null>(null);

	useEffect(() => {
		getUser().then(({ status, data: reqUser, sessionId }) => {
			if (status === 200) {
				setUser(unserializeUser(reqUser));
				setSessionId(sessionId ?? null);
			}
			setLoading(false);
		});
	}, []);

	async function updateUser(update: Partial<SafeUser>) {
		if (!user || loading) return;

		// Cancel previous update request
		if (updateUserAbortController.current) {
			updateUserAbortController.current.abort();
		}
		const abort = new AbortController();
		updateUserAbortController.current = abort;

		try {
			const { status, body } = await query<SafeUser>(`/user/${user.id}`, {
				method: "PATCH",
				body: JSON.stringify(update),
				signal: abort.signal,
			});

			if (status === 200) {
				setUser(unserializeUser(body));
				return;
			}
			console.error("Failed to update user");
		} catch (error) {
			console.error(error);
		} finally {
			updateUserAbortController.current = null;
		}
	}

	async function handleSignout() {
		setLoading(true);
		const { status } = await signOut();

		if (status === 204) {
			setUser(null);
			setSessionId(null);
			setLoading(false);
			return true;
		}
		console.error("Failed to sign out");
		setLoading(false);
		return false;
	}

	return (
		<AuthContext.Provider value={{ user, sessionId, loading, signOut: handleSignout, updateUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export const AuthProvider = dynamic(() => Promise.resolve(_AuthProvider), { ssr: false });
