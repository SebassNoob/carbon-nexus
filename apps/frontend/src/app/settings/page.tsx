"use client";
import { Tabs } from "@lib/components";

export default function SettingsPage() {
	return (
		<Tabs.Tabs>
			<Tabs.TabList className="overflow-x-scroll">
				<Tabs.Tab>Preferences</Tabs.Tab>
				<Tabs.Tab>Account</Tabs.Tab>
				<Tabs.Tab>Profile</Tabs.Tab>
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
