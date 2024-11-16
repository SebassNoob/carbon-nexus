"use client";
import { BooleanSettingsRow } from "..";
import { useState } from "react";
import { Autocomplete } from "@lib/components";

// TODO: add data fetching
const timezones = Intl.supportedValuesOf("timeZone");

export function Preferences() {
	const [selectedTimezone, setSelectedTimezone] = useState("");

	const handleTimezoneChange = (timezone: string) => {
		setSelectedTimezone(timezone);
	};
	return (
		<div className="space-y-4">
			<BooleanSettingsRow label="Dark Mode" value={true} onChange={(value) => console.log(value)} />
			<BooleanSettingsRow label="timezone" value={true} onChange={(value) => console.log(value)} />
			<BooleanSettingsRow
				label="Reduced Motion"
				value={true}
				onChange={(value) => console.log(value)}
			/>
			<Autocomplete
				items={timezones}
				handleChange={handleTimezoneChange}
				initialValue={selectedTimezone}
				label="Search Timezone"
				placeholder="Enter timezone"
			/>
		</div>
	);
}
