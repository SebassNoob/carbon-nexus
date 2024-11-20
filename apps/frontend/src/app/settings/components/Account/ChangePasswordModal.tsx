"use client";
import {
	Modal,
	TextInput,
	Title,
	Text,
	Button,
	ModalCloseButton,
} from "@lib/components";
import { useContext } from "react";
import { AuthContext } from "@lib/providers";
import { useForm } from "react-hook-form";
import { ChangePasswordInputSchema } from "@shared/common/schemas";
import type { ChangePasswordInput } from "@shared/common/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { twMerge } from "tailwind-merge";
import type { ChangePasswordModalProps } from "./types";

export function ChangePasswordModal(props: ChangePasswordModalProps) {
	const { loading } = useContext(AuthContext);
	const { register, handleSubmit, formState } = useForm<ChangePasswordInput>({
		resolver: zodResolver(ChangePasswordInputSchema),
	});

	return (
		<Modal className={twMerge("flex-col flex gap-2 w-80 sm:w-full", props.className)} {...props}>
			<div className="flex justify-between">
				<Title order={5}>Delete Account</Title>
				<ModalCloseButton onClick={props.onClose} />
			</div>

			<Text order="sm">
				Enter your username (case-sensitive) to confirm. There's no going back!
			</Text>
			<form onSubmit={handleSubmit(props.onSubmit)} className="flex flex-col justify-center gap-4">
				<TextInput
					label="Username"
					placeholder="Enter your username"
					disabled={loading}
					{...register("oldPassword")}
					variant={formState.errors.oldPassword ? "error" : undefined}
					helperText={formState.errors.oldPassword?.message as string}
				/>
				<TextInput
					label="Username"
					placeholder="Enter your username"
					disabled={loading}
					{...register("newPassword")}
					variant={formState.errors.newPassword ? "error" : undefined}
					helperText={formState.errors.newPassword?.message as string}
				/>
				<TextInput
					label="Username"
					placeholder="Enter your username"
					disabled={loading}
					{...register("repeatPassword")}
					variant={formState.errors.repeatPassword ? "error" : undefined}
					helperText={formState.errors.repeatPassword?.message as string}
				/>
				<Button type="submit" color="danger">
					Delete Account
				</Button>
			</form>
		</Modal>
	);
}
