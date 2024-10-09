"use client";

import { useState, createContext, useEffect } from "react";
import type { AuthContextProps, AuthProviderProps } from "./types";
import type { SafeUser, Serialized } from "@shared/common/types";
import { signOut } from "@lib/actions";
import { getUser } from "@lib/actions";
import dynamic from "next/dynamic";

export const AuthContext = createContext<AuthContextProps>({
	user: null,
	sessionId: null,
	loading: true,
	signOut: async () => false,
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

	useEffect(() => {
		getUser().then(({ status, data: reqUser, sessionId }) => {
			if (status === 200) {
				setUser(unserializeUser(reqUser));
				setSessionId(sessionId ?? null);
			}
			setLoading(false);
		});
	}, []);

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
		<AuthContext.Provider value={{ user, sessionId, loading, signOut: handleSignout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const AuthProvider = dynamic(() => Promise.resolve(_AuthProvider), { ssr: false });
