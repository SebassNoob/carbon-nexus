import { Text } from "@lib/components";

export function Footer() {
	return (
		<footer>
			<div className="flex justify-center items-center p-6">
				<Text className="text-zinc-600 dark:text-zinc-300">
					Made with ❤️ © SebassNoob {new Date().getFullYear()}
				</Text>
			</div>
		</footer>
	);
}
