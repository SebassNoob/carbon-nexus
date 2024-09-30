"use client";
import { useState, useLayoutEffect, useEffect, cache } from "react";
import { query } from "@utils";
import { getUser } from "@lib/actions";
import type { Theme } from "./types";
import type { SafeUser } from "@shared/common/types";

const getCachedUser = cache(async () => await getUser());
export function useTheme() {
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
		localStorage.setItem("theme", theme);
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	useEffect(() => {
		const abort = new AbortController();
		const updateTheme = async () => {
			const user = await getCachedUser();
			if (!user.data?.id) return;

			try {
				await query<SafeUser>(`/user/${user.data.id}`, {
					method: "PATCH",
					body: JSON.stringify({ theme }),
					signal: abort.signal,
				});
			} catch (error) {
				// fail silently
			}
		};
		updateTheme();
		return () => {
			abort.abort();
		};
	}, [theme]);

	return {
		theme,
		setTheme,
	};
}
