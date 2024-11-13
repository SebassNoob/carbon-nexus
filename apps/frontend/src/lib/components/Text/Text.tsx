import type { TextProps } from "./types";
import { twMerge } from "tailwind-merge";

const defaultStyles = "text-zinc-600 dark:text-zinc-300";

export function Text({ children, order = "base", className, ...rest }: TextProps) {
	const textSize = `text-${order}` as const;
	const mergedStyles = twMerge(defaultStyles, textSize, className);
	return (
		<p className={mergedStyles} {...rest}>
			{children}
		</p>
	);
}
