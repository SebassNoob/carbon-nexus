import { Card } from "@lib/components";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<Card className="dark:bg-slate-950 sm:w-2/3 w-11/12">{children}</Card>
		</div>
	);
}
