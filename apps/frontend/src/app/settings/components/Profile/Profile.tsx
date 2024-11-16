"use client";
import { UpdateUserInputSchema } from "@shared/common/schemas";
import { TextSettingsRow } from "..";

// TODO: add data fetching

// biome-ignore lint/suspicious/noExplicitAny: todo
function _simulateApiCall(data: any) {
	return new Promise<void>((r) => {
		// biome-ignore lint/suspicious/noConsole: todo
		console.log(data);
		setTimeout(r, 1000);
	});
}

export function Profile() {
	return (
		<div className="space-y-4">
			<TextSettingsRow
				fieldKey="username"
				label="Display Name"
				value="placeholder"
				description="Your username is used for login and display."
				onSubmit={_simulateApiCall}
				schema={UpdateUserInputSchema.required().shape.username}
			/>
		</div>
	);
}
