import type { BooleanSettingsRowProps } from "./types";
import { Text, Toggle } from "@lib/components";

export function BooleanSettingsRow({ label, value, onChange }: BooleanSettingsRowProps) {
	return (
		<div className="flex gap-2 p-2 items-center justify-between">
			<Text order="lg">{label}</Text>
			<Toggle defaultChecked={value} onChange={(e) => onChange(e.target.checked)} />
		</div>
	);
}
