"use client";
import { useRouter } from "next/navigation";
import { Logo, Image, Text } from "@lib/components";
import { Popover } from "react-tiny-popover";
import { useContext, useState } from "react";
import { ClientContext } from "@lib/providers";

export function Header() {
	const router = useRouter();
	const { theme, setTheme } = useContext(ClientContext);
	const [menuOpen, setMenuOpen] = useState(false);

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
				<Popover
					isOpen={menuOpen}
					positions={["bottom", "left"]}
					onClickOutside={() => setMenuOpen((value) => !value)}
					containerClassName="transition-all"
					align="end"
					padding={5}
					content={
						<div className="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
							<button className="flex justify-between gap-3 items-center px-4 py-2 hover:dark:bg-gray-700  hover:bg-gray-100 rounded-lg">
								<Image src="/common/user.svg" alt="menu" height={20} width={20} />
								<Text order="sm">settings</Text>
							</button>
							<button className="flex justify-between gap-3 items-center px-4 py-2 hover:dark:bg-gray-700  hover:bg-gray-100 rounded-lg">
								<Image src="/common/user.svg" alt="menu" height={20} width={20} />
								<Text order="sm">settings</Text>
							</button>
							<button className="flex justify-between gap-3 items-center px-4 py-2 hover:dark:bg-gray-700  hover:bg-gray-100 rounded-lg">
								<Image src="/common/user.svg" alt="menu" height={20} width={20} />
								<Text order="sm">settings</Text>
							</button>
						</div>
					}
				>
					<button
						onClick={() => setMenuOpen((value) => !value)}
						className="p-2 rounded bg-slate-200 dark:bg-slate-800"
						data-testid="theme-toggle"
						tabIndex={-1}
						type="button"
					>
						{theme === "light" ? (
							<Image src="/common/user.svg" alt="menu" className="h-6 w-6" height={24} width={24} />
						) : (
							<Image
								src="/common/user.svg"
								alt="menu"
								className="h-6 w-6 invert"
								height={24}
								width={24}
							/>
						)}
					</button>
				</Popover>
			</div>
		</header>
	);
}
