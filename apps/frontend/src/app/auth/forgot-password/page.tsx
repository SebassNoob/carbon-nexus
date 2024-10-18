import { ForgotPasswordForm } from "./components";
import { Title, Text, Link, OAuthButton } from "@lib/components";

export default function ForgotPassword() {
	return (
		<>
			<Title order={3}>Forgot Password</Title>
			<Text>Please enter the email you registered with to reset your password.</Text>

			<ForgotPasswordForm />
			<Text>
				Go back to:{" "}
				<Link href="/auth/signup" className="text-blue-500">
					Sign In
				</Link>
			</Text>
		</>
	);
}
