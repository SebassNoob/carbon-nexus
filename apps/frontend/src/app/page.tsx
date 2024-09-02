import Image from "next/image";
import { appFetch } from "@utils/fetcher";

export default async function Home() {
	const res = await appFetch("http://localhost:8000", { cache: "no-store" });
	console.log(res);
	return <div>{JSON.stringify(res)}</div>;
}
