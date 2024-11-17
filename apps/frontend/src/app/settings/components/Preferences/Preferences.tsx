"use client";
import { AutocompleteSettingsRow, BooleanSettingsRow } from "..";

// TODO: add data fetching
const timezones = Intl.supportedValuesOf("timeZone");

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

			<AutocompleteSettingsRow
				fieldKey="timezone"
				label="Timezone"
				value={"UTC"}
				items={timezones}
				onSubmit={async (_value) => {
					// artificial delay
					await new Promise((resolve) => setTimeout(resolve, 1000));
				}}
			/>
		</div>
	);
}
