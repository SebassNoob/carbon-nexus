type OAuthProviders = "discord" | "google" | "github";

export const sessionCookieName = "sessionId" as const;

export const oAuthCookieNames = {
	discord: {
		state: "discordOauthState",
	},
	google: {
		state: "googleOauthState",
		codeVerifier: "googleOauthCodeVerifier",
	},
	github: {
		state: "githubOauthState",
	},
} as const satisfies {
	[key in OAuthProviders]: {
		state: string;
		codeVerifier?: string;
	};
};
