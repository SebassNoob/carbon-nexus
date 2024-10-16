"use client";

import { useState, createContext, useEffect, useRef } from "react";
import type { AuthContextProps, AuthProviderProps } from "./types";
import type { SafeUser, Serialized, SignInInput, SignUpInput } from "@shared/common/types";
import { signOut, getUser } from "@lib/actions";
import { query } from "@utils";
import dynamic from "next/dynamic";

export const AuthContext = createContext<AuthContextProps>({
	user: null,
	tokenId: null,
	loading: true,
	signOut: async () => 0,
	signIn: async () => 0,
	signUp: async () => 0,
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
	const [tokenId, setTokenId] = useState<string | null>(null);

	// AbortController to cancel updateUser requests
	const updateUserAbortController = useRef<AbortController | null>(null);

	function syncUser() {
		getUser().then(({ status, data: reqUser, tokenId }) => {
			if (status === 200) {
				setUser(unserializeUser(reqUser));
				setTokenId(tokenId ?? null);
			}
			setLoading(false);
		});
	}

	useEffect(syncUser, []);

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

	async function handleSignout(): Promise<number> {
		setLoading(true);
		const { status } = await signOut();

		if (status === 204) {
			setUser(null);
			setTokenId(null);
		}
		setLoading(false);
		return status;
	}

	async function handleSignIn(input: SignInInput): Promise<number> {
		const { status } = await query<void>("/auth/signin", {
			method: "POST",
			body: JSON.stringify(input),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});
		if (status === 201) {
			syncUser();
		}
		return status;
	}

	async function handleSignUp(input: SignUpInput): Promise<number> {
		const { status } = await query<void>("/auth/signup", {
			method: "POST",
			body: JSON.stringify(input),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});
		if (status === 201) {
			syncUser();
		}
		return status;
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				tokenId,
				loading,
				signOut: handleSignout,
				signIn: handleSignIn,
				signUp: handleSignUp,
				updateUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const AuthProvider = dynamic(() => Promise.resolve(_AuthProvider), { ssr: false });
