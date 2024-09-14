"use client";
import { createContext } from "react";
import { useTheme, useBreakpoint } from "@lib/hooks";
import type { ClientContextProps, ClientProviderProps } from "./types";
import { useMemo } from "react";

export const ClientContext = createContext<ClientContextProps>({
	theme: "light",
	setTheme: () => {},
	breakpoint: "sm",
	isMobile: false,
});

export const ClientProvider = ({ children }: ClientProviderProps) => {
	const { theme, setTheme } = useTheme();
	const { breakpoint, isMobile } = useBreakpoint();

	const value = useMemo(
		() => ({ theme, setTheme, breakpoint, isMobile }),
		[theme, setTheme, breakpoint, isMobile],
	);

	return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};
