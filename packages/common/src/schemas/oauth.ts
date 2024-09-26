import { z } from "zod";

export const OpenAuthCallbackSchema = z.object({
	code: z.string(),
	state: z.string(),
}) as z.ZodType<{ code: string; state: string }>;
