"use client";
import { UpdateUserInputSchema } from "@shared/common/schemas";
import { TextSettingsRow } from "./TextSettingsRow";
import { BooleanSettingsRow } from "./BooleanSettingsRow";

// TODO: change styling to use modal
// TODO: add data fetching

export function Account() {
	return (
		<div className="space-y-4">
			<TextSettingsRow
				label="Email"
				value="placeholder@gmail.com"
				description="Your email is used for login and notifications."
				onSubmit={async (a) => {
					//simulate api call
					await new Promise((r) => {
						setTimeout(r, 1000);
					});
					// biome-ignore lint/suspicious/noConsole: todo
					console.log(a);
				}}
				schema={UpdateUserInputSchema.required().shape.email}
			/>
			<BooleanSettingsRow label="Receive notifications" value={true} onChange={() => {}} />
		</div>
	);
}
