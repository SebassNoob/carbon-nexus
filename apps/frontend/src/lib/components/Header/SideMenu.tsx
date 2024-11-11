"use client";
import { useState, useCallback, useContext } from "react";
import { AuthContext, ClientContext } from "@lib/providers";
import { Image } from "@lib/components";
import { toast } from "react-hot-toast";
import { Popover } from "react-tiny-popover";
import { SideMenuButton } from "./SideMenuButton";
import { useRouter } from "next/navigation";

export function SideMenu() {
	const { user, loading, signOut } = useContext(AuthContext);
	const { theme } = useContext(ClientContext);
	const [open, setOpen] = useState(false);

	const router = useRouter();

	const signOutResponse = useCallback(() => {
		signOut().then((status) => {
			if (status === 204) {
				toast.success("Signed out successfully");
				router.refresh();
			} else {
				toast.error("Failed to sign out");
			}
		});
	}, [signOut, router]);

	const renderAuthButton = useCallback(() => {
		if (loading) return null;
		if (!user)
			return (
				<>
					<SideMenuButton
						icon="/common/signin.svg"
						text="Sign In"
						onClick={() => router.push("/auth/signin")}
					/>
					<SideMenuButton
						icon="/common/signin.svg"
						text="Sign Up"
						onClick={() => router.push("/auth/signup")}
					/>
				</>
			);

		return (
			<SideMenuButton
				icon="/common/signin.svg"
				imageClassname="-scale-x-100"
				text="Sign Out"
				onClick={signOutResponse}
			/>
		);
	}, [user, loading, signOutResponse, router]);

	return (
		<Popover
			isOpen={open}
			positions={["bottom", "left"]}
			onClickOutside={() => setOpen((value) => !value)}
			containerClassName="transition-all"
			align="end"
			padding={5}
			content={
				<div className="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
					<SideMenuButton
						icon="/common/settings.svg"
						text="Settings"
						onClick={() => router.push("/settings")}
					/>
					{renderAuthButton()}
				</div>
			}
		>
			<button
				onClick={() => setOpen((value) => !value)}
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
	);
}
