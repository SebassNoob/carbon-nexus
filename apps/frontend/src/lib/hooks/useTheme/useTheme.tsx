"use client";
import { useState, useLayoutEffect, useEffect, useContext, useRef } from "react";
import { AuthContext } from "@lib/providers";
import type { Theme } from "./types";

export function useTheme() {
	const { user, loading, updateUser } = useContext(AuthContext);
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

	const prevThemeRef = useRef<Theme | null>(null);

	// on initial render, set the theme class on the html element
	useLayoutEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	// always update the local storage when the theme changes
	useEffect(() => {
		localStorage.setItem("theme", theme);
	}, [theme]);

	// if the user is not loaded yet, do nothing
	// if the user is loaded, set the theme to the user's theme
	useEffect(() => {
		if (loading || !user) return;

		setTheme(user.theme as Theme);
	}, [loading, user]);

	// if the theme has changed, update the user
	useEffect(() => {
		if (loading || !user) return;

		// Only update the backend if the theme has changed
		if (prevThemeRef.current !== theme) {
			updateUser({ theme });
			prevThemeRef.current = theme;
		}
	}, [theme, loading, user, updateUser]);

	return {
		theme,
		setTheme,
	};
}
