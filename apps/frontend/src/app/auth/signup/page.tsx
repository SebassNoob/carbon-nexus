import { SignUpForm } from "./components";
import { Card, Title, Text, Link } from "@lib/components";

export default function SignIn() {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<Card className="dark:bg-slate-900 sm:w-2/3 w-5/6">
				<Title order={3}>Sign Up</Title>
				<Text>Welcome! Fill in your details to get started.</Text>
				<SignUpForm />
				<Text>
					Already have an account?{" "}
					<Link href="/auth/signin" className="text-blue-500">
						Sign in
					</Link>
				</Text>
			</Card>
		</div>
	);
}
