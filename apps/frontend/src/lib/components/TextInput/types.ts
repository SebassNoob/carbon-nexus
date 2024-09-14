import type { InputHTMLAttributes } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	variant?: "success" | "error";
	helperText?: string;
	disabled?: boolean;
	className?: string;
}
