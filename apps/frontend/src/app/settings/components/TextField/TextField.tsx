"use client";
import { TextInput, Button } from "@lib/components";
import { useTransition } from "react";
import { useForm, type DefaultValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TextFieldProps } from "./types";

export function TextField<T extends string>({
	fieldKey,
	label,
	value,
	onChange,
	placeholder,
	zodSchema,
}: TextFieldProps<T>) {
	const [isPending, startTransition] = useTransition();
	const { register, handleSubmit, formState } = useForm<Record<typeof fieldKey, string>>({
		resolver: zodResolver(
			z.object({
				[fieldKey]: zodSchema,
			}),
		),
		defaultValues: {
			[fieldKey]: value,
		} as DefaultValues<Record<T, string>>,
	});

	const onSubmit = (data: Record<T, string>) => {
		startTransition(async () => {
			await onChange(data);
		});
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex gap-4 w-full items-center">
				<TextInput
					label={label}
					disabled={isPending}
					placeholder={placeholder}
					{...register(fieldKey as unknown as Path<Record<T, string>>)}
					variant={formState.errors[fieldKey] ? "error" : undefined}
					helperText={formState.errors[fieldKey]?.message as string}
					className="w-full"
				/>
				<Button disabled={isPending} type="submit" className="grow-0">
					Submit
				</Button>
			</div>
		</form>
	);
}