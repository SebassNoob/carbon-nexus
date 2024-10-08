"use client";
import { useContext } from "react";
import { AuthContext } from "@lib/providers";
import { toast } from "react-hot-toast";
import { Button } from "@lib/components";

export function SignOutButton() {
	const { signOut } = useContext(AuthContext);

	const signOutResponse = () => {
		signOut().then((success) => {
			if (success) {
				toast.success("Signed out successfully");
			} else {
				toast.error("Failed to sign out");
			}
		});
	};

	return <Button onClick={signOutResponse}>Sign Out</Button>;
}
