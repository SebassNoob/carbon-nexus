import { query } from "@utils";
import { Text, Code, Button, Title } from "@lib/components";
import type { SafeUser } from "@shared/common/types";
import { cookies } from "next/headers";

export default async function Home() {
	const cookieStore = cookies();
	const sessionCookie = cookieStore.get("sessionId")?.value;

	const data = await query<SafeUser>(`/auth/me?sessionId=${sessionCookie}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	return (
		<div>
			<Title order={1}>Hello!</Title>
			<Text order="lg">
				Welcome to your new app. Edit <Code>apps/frontend/src/page.tsx</Code> to get started!
			</Text>
			<div className="mt-4 flex flex-col gap-2">
				<Text>Built in authentication:</Text>
				<Code>{JSON.stringify(data)}</Code>
				<div>
					<Button href="/auth/signin">Sign In</Button>
					<Button href="/auth/signout">Sign Out</Button>
				</div>
			</div>
		</div>
	);
}
