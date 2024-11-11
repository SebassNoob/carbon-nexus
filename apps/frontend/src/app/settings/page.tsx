"use client";
import { Tabs } from "@lib/components";

export default function SettingsPage() {
	return (
		<Tabs.Tabs>
			<Tabs.TabList>
				<Tabs.Tab>General</Tabs.Tab>
				<Tabs.Tab>Security</Tabs.Tab>
				<Tabs.Tab>Notifications</Tabs.Tab>
			</Tabs.TabList>

			<Tabs.TabPanel>
				<h2>General settings</h2>
			</Tabs.TabPanel>
			<Tabs.TabPanel>
				<h2>Security settings</h2>
			</Tabs.TabPanel>
			<Tabs.TabPanel>
				<h2>Notification settings</h2>
			</Tabs.TabPanel>
		</Tabs.Tabs>
	);
}
