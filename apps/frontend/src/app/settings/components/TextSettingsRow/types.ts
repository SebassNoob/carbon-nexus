import type { ZodString } from "zod";
export interface TextSettingsRowProps {
	label: string;
	description?: string;
	value?: string;
	schema: ZodString;
	onSubmit: (value: Record<string, string>) => Promise<void>;
	reducedMotion?: boolean;
}
