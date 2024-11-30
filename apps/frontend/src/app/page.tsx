import { Text } from "@lib/components";
import { getUser } from "@lib/actions";
import { Features, Hero } from "./components";

export default async function Home() {
	const { data } = await getUser();
	console.info("logged in user", data);

	return (
		<div>
			<Hero />
			<Features />
		</div>
	);
}
