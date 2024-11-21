import { Text, Code, Title } from "@lib/components";
import { getUser } from "@lib/actions";

export default async function Home() {
	const { data } = await getUser();

	return (
		<div>
			<Title order={1}>Hello!</Title>
			<Text order="lg">
				Welcome to your new app. Edit <Code>apps/frontend/src/page.tsx</Code> to get started!
			</Text>
			<div className="mt-4 flex flex-col gap-2">
				<Text>Built in authentication:</Text>
				<table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<tbody>
						<tr className="border-b dark:border-gray-700">
							<td className="px-4 py-2 ">
								<Text>ID:</Text>
							</td>
							<td className="px-4 py-2 ">
								<Text>{data?.id ?? "null"}</Text>
							</td>
						</tr>
						<tr className="border-b dark:border-gray-700">
							<td className="px-4 py-2 ">
								<Text>Email:</Text>
							</td>
							<td className="px-4 py-2 ">
								<Text>{data?.email ?? "null"}</Text>
							</td>
						</tr>
						<tr className="border-b dark:border-gray-700">
							<td className="px-4 py-2 ">
								<Text>Username:</Text>
							</td>
							<td className="px-4 py-2 ">
								<Text>{data?.username ?? "null"}</Text>
							</td>
						</tr>
						<tr>
							<td className="px-4 py-2 ">
								<Text>CreatedAt:</Text>
							</td>
							<td className="px-4 py-2 ">
								<Text>{data?.createdAt.toISOString() ?? "null"}</Text>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
