"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInInputSchema } from "@shared/common/schemas";
import type { SignInInput } from "@shared/common/types";
import { Button, TextInput } from "@lib/components";
import { query } from "@utils";
import { revalidatePath } from "next/cache";

export function SignInForm() {
	const { register, handleSubmit, formState } = useForm<SignInInput>({
		resolver: zodResolver(SignInInputSchema),
	});

	const onSubmit = handleSubmit(async (data) => {
		const [status, res] = await query<void>("/auth/signin", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});
	});

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4">
			<TextInput
				label="Email"
				type="text"
				variant={formState.errors.email ? "error" : undefined}
				helperText={formState.errors.email?.message}
				{...register("email")}
			/>
			<TextInput label="Password" type="password" {...register("password")} />
			<Button type="submit">Sign In</Button>
		</form>
	);
}
