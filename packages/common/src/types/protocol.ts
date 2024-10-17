import type { Serialized } from "./utils";

export type ErrorResponse = {
	path: string;
	name: string;
	cause: unknown;
};

type Metadata = {
	success: boolean;
	timestamp: string;
};

type Content<T> = {
	data: T | null;
	error: ErrorResponse | null;
};

export type SerializedResponsePayload<T> = Metadata & {
	[K in keyof Content<T>]: Serialized<Content<T>[K]>;
};

export type ResponsePayload<T> = Metadata & Content<T>;
