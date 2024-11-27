import type { GaugeProps } from "./types";
import { twMerge } from "tailwind-merge";

const infoStyles = "text-blue-600 dark:text-blue-500";
const dangerStyles = "text-red-600 dark:text-red-500";
const warningStyles = "text-yellow-600 dark:text-yellow-500";
const successStyles = "text-green-600 dark:text-green-500";

export function Gauge({ progress, className, children, color = "info" }: GaugeProps) {
	const colorStyles = {
		info: infoStyles,
		danger: dangerStyles,
		warning: warningStyles,
		success: successStyles,
	};

	return (
		<div className={twMerge("relative size-36", className)}>
			<svg className="rotate-[135deg] size-" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
				<circle
					cx="18"
					cy="18"
					r="16"
					fill="none"
					className="stroke-current text-gray-200 dark:text-neutral-700"
					strokeWidth="3"
					strokeDasharray="75 100"
					strokeLinecap="round"
				></circle>

				<circle
					cx="18"
					cy="18"
					r="16"
					fill="none"
					className={`stroke-current ${colorStyles[color]}`}
					strokeWidth="3"
					strokeDasharray={`${(progress / 100) * 75} 100`}
					strokeLinecap="round"
				></circle>
			</svg>

			<div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
				{children}
			</div>
		</div>
	);
}
