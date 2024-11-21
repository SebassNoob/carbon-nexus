"use client";
import { UpdateUserInputSchema } from "@shared/common/schemas";
import { ButtonSettingsRow, TextSettingsRow } from "..";
import { useState } from "react";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { ChangePasswordModal } from "./ChangePasswordModal";

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
	const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
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
			<ButtonSettingsRow
				label="Change Password"
				buttonLabel="Change"
				onClick={() => setChangePasswordModalOpen(true)}
			/>
			<ButtonSettingsRow
				label="Verify Email"
				buttonLabel="Verify"
				onClick={() => _simulateApiCall(undefined)}
			/>
			<ButtonSettingsRow
				label="Delete Account"
				buttonLabel="Delete"
				onClick={() => setDeleteModalOpen(true)}
				buttonColor="danger"
			/>
			<DeleteAccountModal
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onSubmit={_simulateApiCall}
			/>
			<ChangePasswordModal
				isOpen={changePasswordModalOpen}
				onClose={() => setChangePasswordModalOpen(false)}
				onSubmit={_simulateApiCall}
			/>
		</div>
	);
}
