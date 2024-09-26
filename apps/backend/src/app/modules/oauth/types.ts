export interface InitOAuthData {
	state: string;
	url: string;
	codeVerifier?: string;
}

export type DiscordUser = {
	id: string;
	email: string | null;
	username: string;
};
