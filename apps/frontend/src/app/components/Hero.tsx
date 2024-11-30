
import { Title, Text, Code } from "@lib/components";

export function Hero() {
	return (
		<div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center ">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#262626_0.5px,transparent_0.5px),linear-gradient(to_bottom,#262626_0.5px,transparent_0.5px)] [mask-image:linear-gradient(20deg,rgba(255,255,255,0.05),rgba(255,255,255,0.7),rgba(255,255,255,0.05))] bg-[size:40px_40px]" />
			<div className="z-10 p-4">
				<Title order={1}>
					Hello!
				</Title>
				<Text order="lg">
					Welcome to your new app. Edit <Code>apps/frontend/src/page.tsx</Code> to get started!
				</Text>
			</div>
		</div>
	);
}
