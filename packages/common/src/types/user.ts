import type { Prettify } from "./utils";
export type SafeUser = {
	id: string;
	username: string;
	email: string | null;
	createdAt: Date;
	verified: boolean;

	// User preferences
	theme: string;
	reducedMotion: boolean;
	timezone: string;
};

export type GetUserInput = {
	id: string;
};

export type UpdateUserInput = Prettify<Partial<Omit<SafeUser, "id">>>;
