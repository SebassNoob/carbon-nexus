export type SafeUser = {
	id: string;
	username: string;
	email: string;
	createdAt: Date;
};

export type SignUpInput = {
	username: string;
	email: string;
	password: string;
	repeatPassword: string;
};

export type SignInInput = {
	email: string;
	password: string;
};

export type SessionCookie = {
	id: string;
	expiresAt: Date;
};
