import type { ButtonSettingsRowProps } from "./types";
import { Text, Button } from "@lib/components";

export function ButtonSettingsRow({
	label,
	buttonLabel,
	onClick,
	buttonColor,
}: ButtonSettingsRowProps) {
	return (
		<div className="flex gap-2 p-2 items-center justify-between">
			<Text order="lg">{label}</Text>
			<Button onClick={onClick} color={buttonColor}>
				{buttonLabel}
			</Button>
		</div>
	);
}
