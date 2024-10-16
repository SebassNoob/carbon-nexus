"use client";
import { useRouter } from "next/navigation";
import { Logo, Image } from "@lib/components";
import { useContext } from "react";
import { ClientContext } from "@lib/providers";
import { SideMenu } from "./SideMenu";
export function Header() {
	const router = useRouter();
	const { theme, setTheme } = useContext(ClientContext);

	return (
		<header className="flex items-center justify-between p-4">
			<div
				className="flex items-center cursor-pointer"
				onClick={() => router.push("/")}
				onKeyDown={(e) => e.key === "Enter" && router.push("/")}
			>
				<Logo />
			</div>
			<div className="flex gap-2">
				<button
					onClick={() => setTheme(theme === "light" ? "dark" : "light")}
					className="p-2 rounded bg-slate-200 dark:bg-slate-800"
					data-testid="theme-toggle"
					tabIndex={-1}
					type="button"
				>
					{theme === "light" ? (
						<Image
							src="/common/moon.svg"
							alt="dark mode"
							className="h-6 w-6"
							height={24}
							width={24}
						/>
					) : (
						<Image
							src="/common/sun.svg"
							alt="light mode"
							className="h-6 w-6"
							height={24}
							width={24}
						/>
					)}
				</button>
				<SideMenu />
			</div>
		</header>
	);
}
