"use client";
import { UpdateUserInputSchema } from "@shared/common/schemas";
import { ButtonSettingsRow, TextSettingsRow } from "..";

// TODO: add data fetching

// biome-ignore lint/suspicious/noExplicitAny: todo
function _simulateApiCall(data: any) {
	return new Promise<void>((r) => {
		// biome-ignore lint/suspicious/noConsole: todo
		console.log(data);
		setTimeout(r, 1000);
	});
}

export function Account() {
	return (
		<div className="space-y-4">
			<TextSettingsRow
				fieldKey="email"
				label="Email"
				value="placeholder@gmail.com"
				description="Your email is used for login and notifications."
				onSubmit={_simulateApiCall}
				schema={UpdateUserInputSchema.required().shape.email}
			/>
			<TextSettingsRow
				fieldKey="username"
				label="Password"
				value="********"
				description="Your username is used for login and display."
				onSubmit={_simulateApiCall}
				schema={UpdateUserInputSchema.required().shape.username}
			/>
			<ButtonSettingsRow label="Change Password" buttonLabel="Change" onClick={() => {}} />
			<ButtonSettingsRow label="Verify Email" buttonLabel="Verify" onClick={() => {}} />
			<ButtonSettingsRow
				label="Delete Account"
				buttonLabel="Delete"
				onClick={() => {}}
				buttonColor="danger"
			/>
		</div>
	);
}
