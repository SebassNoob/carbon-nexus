import { z } from "zod";
import type { DiscordUser, GoogleUser } from "./types";

export const DiscordUserSchema = z.object({
	id: z.string(),
	email: z.string().nullable(),
	username: z.string(),
}) satisfies z.ZodType<DiscordUser>;

export const GoogleUserSchema = z.object({
	sub: z.string(),
	email: z.string().nullable(),
	name: z.string(),
}) satisfies z.ZodType<GoogleUser>;
