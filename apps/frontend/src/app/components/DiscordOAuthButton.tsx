"use client";
import { toast } from "react-hot-toast";
import { Button } from "@lib/components";
import { useRouter } from "next/navigation";
import { query } from "@utils";

export function DiscordOAuthButton() {
	const router = useRouter();
	const initDiscordOAuth = async () => {
		const { data, status } = await query<{ url: string }>("/oauth/discord", {
			method: "GET",
			credentials: "include",
		});

		if (status !== 200) {
			toast.error("Failed to redirect to Discord OAuth, try again later.");
			return;
		}
		const location = data?.url;
		if (!location) {
			toast.error("Failed to redirect to Discord OAuth, try again later.");
			return;
		}
		router.push(location);
	};

	return <Button onClick={initDiscordOAuth}>use discord n sign in haha</Button>;
}
