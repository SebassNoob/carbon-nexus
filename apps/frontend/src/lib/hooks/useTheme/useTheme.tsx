"use client";
import { useState, useLayoutEffect, useEffect, useContext } from "react";
import { query } from "@utils";
import { AuthContext } from "@lib/providers";
import type { Theme } from "./types";
import type { SafeUser } from "@shared/common/types";

export function useTheme() {
	const { user, loading } = useContext(AuthContext);
	const [theme, setTheme] = useState<Theme>(() => {
		const localStorageTheme = localStorage.getItem("theme");

		if (localStorageTheme === "light" || localStorageTheme === "dark") {
			return localStorageTheme;
		}
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
		return systemTheme;
	});

	useLayoutEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	useEffect(() => {
		if (!loading && user && ["light", "dark"].includes(user.theme)) {
			setTheme(user.theme as Theme);
			localStorage.setItem("theme", user.theme as Theme);
		}
	}, [user, loading]);

	useEffect(() => {
		if (!loading) localStorage.setItem("theme", theme);
		if (!user) return;
		const abort = new AbortController();
		const updateTheme = async () => {
			try {
				await query<SafeUser>(`/user/${user.id}`, {
					method: "PATCH",
					body: JSON.stringify({ theme }),
					signal: abort.signal,
				});
			} catch (error) {
				console.error(error);
			}
		};
		updateTheme();
		return () => {
			abort.abort();
		};
	}, [theme, loading, user]);

	return {
		theme,
		setTheme,
	};
}
