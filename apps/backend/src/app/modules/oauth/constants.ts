import { z } from "zod";
import type { DiscordUser } from "./types";

export const DiscordUserSchema = z.object({
	id: z.string(),
	email: z.string().nullable(),
	username: z.string(),
}) satisfies z.ZodType<DiscordUser>;
