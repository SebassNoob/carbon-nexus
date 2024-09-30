import type { GetUserInput, UpdateUserInput } from "@shared/common/types";
import { z } from "zod";

export const GetUserInputSchema = z.object({
	id: z.string(),
}) satisfies z.ZodType<GetUserInput>;

export const UpdateUserInputSchema = z.object({
	username: z.string().optional(),
	email: z.string().email().optional(),
	verified: z.boolean().optional(),
	preferences: z
		.object({
			theme: z.string().optional(),
			reducedMotion: z.boolean().optional(),
			locale: z.string().optional(),
		})
		.optional(),
}) satisfies z.ZodType<UpdateUserInput>;
