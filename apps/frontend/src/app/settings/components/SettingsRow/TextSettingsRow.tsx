"use client";
import { useState } from "react";
import type { TextSettingsRowProps } from "./types";
import { Text, Button, Modal, Title } from "@lib/components";
import { TextField } from "../TextField";

export function TextSettingsRow({
	fieldKey,
	label,
	value,
	schema,
	onSubmit,
	reducedMotion,
	description,
}: TextSettingsRowProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="flex gap-2 p-2 items-center justify-between">
			<Text order="lg">{label}</Text>

			<div className="flex gap-2 items-center">
				<Text order="sm">{!value ? `No ${label} provided` : value}</Text>
				<Button
					aria-label={`Update ${label}`}
					className="w-8 h-8 flex items-center justify-center border-none rounded-full bg-transparent hover:bg-gray-100 hover:dark:bg-gray-900 hover:text-zinc-700 text-zinc-900 hover:dark:text-zinc-200 dark:text-zinc-100 transition-colors duration-200"
					onClick={() => setOpen(true)}
				>
					<svg
						aria-label={`Update ${label}`}
						className="h-5 min-w-5 fill-current flex-1"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<title>Update {label}</title>
						<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
					</svg>
				</Button>
			</div>
			<Modal
				isOpen={open}
				onClose={() => setOpen(false)}
				reducedMotion={reducedMotion}
				className="flex-col flex gap-2 w-80 sm:w-full"
			>
				<div className="flex justify-between">
					<Title order={5}>Update {label}</Title>
					<Button
						className="w-8 h-8 p-0 flex items-center justify-center border-none rounded-full bg-transparent hover:bg-gray-100 hover:dark:bg-gray-800 hover:text-zinc-700 text-zinc-900 hover:dark:text-zinc-200 dark:text-zinc-100 transition-colors duration-200"
						onClick={() => setOpen(false)}
						tabIndex={-1}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							x="0px"
							y="0px"
							width="100"
							height="100"
							viewBox="0 0 30 30"
							className="h-4 min-w-4 fill-current flex-1"
						>
							<title>Close</title>
							<path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
						</svg>
					</Button>
				</div>
				{description && <Text order="sm">{description}</Text>}
				<TextField
					fieldKey={fieldKey}
					placeholder={`No ${label} provided`}
					value={value}
					onSubmit={async (val) => onSubmit(val).then(() => setOpen(false))}
					zodSchema={schema}
				/>
			</Modal>
		</div>
	);
}
