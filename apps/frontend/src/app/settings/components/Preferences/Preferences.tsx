"use client";
import { BooleanSettingsRow } from "..";

// TODO: add data fetching

export function Preferences() {
	return (
		<div className="space-y-4">
			<BooleanSettingsRow label="Dark Mode" value={true} onChange={(value) => console.log(value)} />
			<BooleanSettingsRow label="timezone" value={true} onChange={(value) => console.log(value)} />
			<BooleanSettingsRow
				label="Reduced Motion"
				value={true}
				onChange={(value) => console.log(value)}
			/>
		</div>
	);
}
