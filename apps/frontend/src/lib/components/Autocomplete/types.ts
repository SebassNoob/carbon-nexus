export type AutocompleteProps = {
	items: string[];
	initialValue?: string;
	handleChange: (value: string) => void;
	label?: string;
	placeholder?: string;
};

export type AutocompleteChoiceProps = {
	item: string;
	onSelect: (item: string) => void;
	isPending?: boolean;
};
