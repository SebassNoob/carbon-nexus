"use client";
import { signOut } from "@lib/actions";
import { toast } from "react-hot-toast";
import { Button } from "@lib/components";

export function SignOutButton() {
	const signOutResponse = () => {
		signOut().then(({ status }) => {
			if (status === 204) {
				toast.success("Signed out successfully");
			} else {
				toast.error("Failed to sign out");
			}
		});
	};

	return <Button onClick={signOutResponse}>Sign Out</Button>;
}
