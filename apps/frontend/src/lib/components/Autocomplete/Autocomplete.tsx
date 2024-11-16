"use client";
import { Popover } from "react-tiny-popover";
import { motion } from "framer-motion";
import { useState, useDeferredValue, useEffect, useRef } from "react";
import { TextInput, Text } from "@lib/components";
import { AutocompleteChoice } from "./AutocompleteChoice";
import type { AutocompleteProps } from "./types";

export function Autocomplete({
	items,
	handleChange,
	initialValue,
	label,
	placeholder,
}: AutocompleteProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState(initialValue ?? "");
	const deferredSearch = useDeferredValue(search);
	const isPending = deferredSearch !== search;
  const ref = useRef<HTMLInputElement>(null);

	const filteredItems = items.filter((item) => item.toLowerCase().includes(search.toLowerCase()));

	return (
		<Popover
			isOpen={open}
			positions={["bottom", "left"]}
			onClickOutside={() => {
				setSearch(initialValue ?? "");
				setOpen(false);
			}}
			align="start"
			padding={5}
      ref={ref}
			content={
				<motion.div
					className="bg-white dark:bg-zinc-900 rounded-md shadow-md p-2 min-w-fit overflow-y-auto max-h-60"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
          style={{ width: ref.current?.clientWidth }}
				>
					{filteredItems.length !== 0 ? (
						filteredItems.map((item) => (
							<AutocompleteChoice
								key={item}
								item={item}
								isPending={isPending}
								onSelect={(item) => {
									setSearch(item);
									setOpen(false);
									handleChange(item);
								}}
							/>
						))
					) : (
						<Text order="sm" className="w-full p-2 text-left rounded-md">
							Nothing found...
						</Text>
					)}
				</motion.div>
			}
		>
			<TextInput
				label={label}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				onFocus={() => setOpen(true)}
				placeholder={placeholder}
				icon={
					<svg
						aria-label="dropdown"
						className="h-5 min-w-5 dark:fill-white flex-1 transform rotate-90"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<title>dropdown</title>
						<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
					</svg>
				}
			/>
		</Popover>
	);
}
