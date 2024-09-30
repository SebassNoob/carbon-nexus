import type { DeepPartial, Prettify } from "./utils";
export type SafeUser = {
	id: string;
	username: string;
	email: string | null;
	createdAt: Date;
	verified: boolean;
	preferences: UserPreferences | null;
};

type UserPreferences = Prettify<{
	theme: string;
	reducedMotion: boolean;
	locale: string;
}>;

export type GetUserInput = {
	id: string;
};

export type UpdateUserInput = Prettify<DeepPartial<Omit<SafeUser, "id">>>;
