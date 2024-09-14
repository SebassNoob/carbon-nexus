import { SignInForm } from "./components";
import { Card, Title } from "@lib/components";

export default function SignIn() {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<Card>
				<Title order={2}>Sign In</Title>
				<SignInForm />
			</Card>
		</div>
	);
}
