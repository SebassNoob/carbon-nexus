import { Title } from "@lib/components";
import { Account, SettingsTabs, type SettingsTabsProps } from "./components";

const tabs = [
	{ name: "Preferences", element: <h2>General settings</h2> },
	{ name: "Account", element: <Account /> },
	{ name: "Profile", element: <h2>Notification settings</h2> },
] as const satisfies SettingsTabsProps["tabs"];

export default function SettingsPage() {
	return (
		<div className="flex flex-col gap-2">
			<Title order={1}>Settings</Title>
			<SettingsTabs tabs={tabs} />
		</div>
	);
}
