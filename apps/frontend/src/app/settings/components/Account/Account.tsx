"use client";
import { UpdateUserInputSchema } from "@shared/common/schemas";
import { ButtonSettingsRow, TextSettingsRow } from "..";
import { useState } from "react";
import { DeleteAccountModal } from "./DeleteAccountModal";

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
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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
			<ButtonSettingsRow label="Change Password" buttonLabel="Change" onClick={() => {}} />
			<ButtonSettingsRow label="Verify Email" buttonLabel="Verify" onClick={() => {}} />
			<ButtonSettingsRow
				label="Delete Account"
				buttonLabel="Delete"
				onClick={() => setDeleteModalOpen(true)}
				buttonColor="danger"
			/>
			<DeleteAccountModal
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onSubmit={(d) => console.log(d)}
			/>
		</div>
	);
}
