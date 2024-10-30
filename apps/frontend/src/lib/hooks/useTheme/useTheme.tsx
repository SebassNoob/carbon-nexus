"use client";
import { useState, useLayoutEffect, useEffect, useContext, useRef } from "react";
import { AuthContext } from "@lib/providers";
import type { Theme } from "./types";

// source of truth: user setting > local storage > system theme

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

  // if the user has a theme preference, use that
  useEffect(() => {
    if (!loading && user && user.theme) {
      setTheme(user.theme as Theme);
    }
  }, [user]);


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


	return {
		theme,
		setTheme,
	};
}
