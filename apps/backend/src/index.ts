import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import type { StatusCode } from "hono/utils/http-status";

const hono = new Hono();

function makeError(status: StatusCode, body: Record<string, unknown>) {
	const res = new Response(JSON.stringify(body), { status });
	throw new HTTPException(status, { res });
}

hono.get("/", (c) => {
	const example = Math.random() > 0.5;

	if (example) {
		makeError(500, { message: "Internal Server Error" });
	}
	return c.json({ message: "Hello from Hono!" });
});

export default {
	port: 8000,
	fetch: hono.fetch,
};
