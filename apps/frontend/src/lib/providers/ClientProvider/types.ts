import type { Breakpoint, Theme } from "@lib/hooks";
import type { ReactNode } from "react";

export interface ClientContextProps {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	breakpoint: Breakpoint;
	isMobile: boolean;
}

export interface ClientProviderProps {
	children: ReactNode;
}
