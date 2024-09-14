import type { CodeProps } from "./types";
import { twMerge } from "tailwind-merge";

const defaultStyle = `
  text-slate-800 dark:text-white
  !bg-transparent
`;

export function Code({ children, className }: CodeProps) {
	const mergedStyles = twMerge(defaultStyle, className);
	return <code className={mergedStyles}>{children}</code>;
}
