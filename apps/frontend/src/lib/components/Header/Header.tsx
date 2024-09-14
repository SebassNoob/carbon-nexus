"use client";
import { useRouter } from "next/navigation";
import { Code } from "@lib/components";
import { useContext } from "react";
import { ClientContext } from "@lib/providers";

export function Header() {
	const router = useRouter();
	const { theme, setTheme } = useContext(ClientContext);

	return (
		<header className="flex items-center justify-between p-4">
			<div
				className="flex items-center cursor-pointer"
				tabIndex={0}
				onClick={() => router.push("/")}
				onKeyDown={(e) => e.key === "Enter" && router.push("/")}
			>
				<pre className="dark:bg-black bg-slate-100 p-2 rounded">
					<Code>Carbon Nexus</Code>
				</pre>
			</div>
			<button
				onClick={() => setTheme(theme === "light" ? "dark" : "light")}
				className="p-2 rounded bg-slate-100 dark:bg-black"
				data-testid="theme-toggle"
				tabIndex={-1}
			>
				{theme === "light" ? (
					<img src="/common/moon.svg" alt="dark mode" className="h-6 w-6" />
				) : (
					<img src="/common/sun.svg" alt="light mode" className="h-6 w-6" />
				)}
			</button>
		</header>
	);
}
