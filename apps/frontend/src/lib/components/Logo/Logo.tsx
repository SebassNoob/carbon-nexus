import { Image, Title } from "@lib/components";
import { twMerge } from "tailwind-merge";
import type { LogoProps } from "./types";

export function Logo(props: LogoProps) {
	return (
		<div {...props} className={twMerge("flex gap-1 h-6 w-full items-center", props.className)}>
			<div className="relative h-8 w-8">
				<Image src="/logo.svg" alt="Logo" />
			</div>
			<Title
				order={1}
				className="text-2xl bg-gradient-to-r from-purple-500 to-blue-700 bg-clip-text text-transparent dark:text-transparent hidden sm:inline-block"
			>
				Carbon Nexus
			</Title>
		</div>
	);
}
