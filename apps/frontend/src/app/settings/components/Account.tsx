"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Text, Modal } from "@lib/components";
import { TextField } from "./TextField";
import { z } from "zod";

// TODO: change styling to use modal
// TODO: add data fetching

export function Account() {
	const [open, setOpen] = useState(false);
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.2 }}
		>
			<div className="space-y-4">
				<div className="flex gap-2 p-2 items-center justify-between">
					<Text order="lg">Email Address</Text>
					<TextField
						fieldKey="email"
						placeholder="No email provided"
						onChange={async (a) => {
							//simulate api call
							await new Promise((r) => {
								setTimeout(r, 1000);
							});
							// biome-ignore lint/suspicious/noConsole: todo
							console.log(a);
						}}
						zodSchema={z.string().email()}
					/>
				</div>
				<Modal
					isOpen={open}
					onClose={() => {
						setOpen(false);
						console.log("closed");
					}}
				>
					<TextField
						fieldKey="email"
						placeholder="No email provided"
						onChange={async (a) => {
							//simulate api call
							await new Promise((r) => {
								setTimeout(r, 1000);
							});
							// biome-ignore lint/suspicious/noConsole: todo
							console.log(a);
						}}
						zodSchema={z.string().email()}
					/>
				</Modal>
				<button onClick={() => setOpen(!open)}>Open</button>
			</div>
		</motion.div>
	);
}