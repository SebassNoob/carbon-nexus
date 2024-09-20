"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInInputSchema } from "@shared/common/schemas";
import type { SignInInput } from "@shared/common/types";
import { Button, TextInput } from "@lib/components";
import { query } from "@utils";
import { toast } from "react-hot-toast";

export function SignInForm() {
	const router = useRouter();
	const { register, handleSubmit, formState } = useForm<SignInInput>({
		resolver: zodResolver(SignInInputSchema),
	});

	const onSubmit = handleSubmit(async (data) => {
		const { status } = await query<void>("/auth/signin", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});
		switch (status) {
			case 201:
				toast.success("Signed in successfully!");
				router.push("/");
				break;
			case 400:
				toast.error("Invalid data provided");
				break;
			case 403:
				toast.error("Invalid credentials");
				break;
      case 404:
        toast.error("User not found");
        break;
			default:
				toast.error("An unexpected error occurred");
				break;
		}
	});

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
			<TextInput
				label="Email"
				type="text"
				variant={formState.errors.email ? "error" : undefined}
				helperText={formState.errors.email?.message}
				{...register("email")}
			/>
			<TextInput
				label="Password"
				type="password"
				{...register("password")}
				variant={formState.errors.password ? "error" : undefined}
				helperText={formState.errors.password?.message}
			/>
			<Button type="submit">Sign In</Button>
		</form>
	);
}
