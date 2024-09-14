"use client";
import { useState, useLayoutEffect } from "react";
import type { Theme } from "./types";

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

	return {
		theme,
		setTheme,
	};
}
