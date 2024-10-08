import type { ReactNode } from "react";
import type { SafeUser } from "@shared/common/types";

export interface AuthContextProps {
	user: SafeUser | null;
	sessionId: string | null;
	loading: boolean;
	signOut: () => Promise<boolean>;
}

export interface AuthProviderProps {
	children: ReactNode;
}
