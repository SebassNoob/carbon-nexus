import { SignInForm } from "./components";
import { Card, Title, Text, Link } from "@lib/components";

export default function SignIn() {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<Card className="dark:bg-slate-900 sm:w-2/3 w-5/6">
				<Title order={3}>Sign In</Title>
				<Text>Welcome back! Please sign in to continue.</Text>
				<SignInForm />
				<Text>
					Don't have an account?{" "}
					<Link href="/auth/signup" className="text-blue-500">
						Sign up
					</Link>
				</Text>
			</Card>
		</div>
	);
}
