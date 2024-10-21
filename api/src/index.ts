import { connectDB } from "@db/index";

connectDB();

const server = Bun.serve({
	async fetch(req) {
		const url = new URL(req.url);
		if (url.pathname === "/")
			return new Response("Welcome to the movie database");
		return new Response("404!");
	},
});
console.log(`Listening on http://localhost:${server.port} ...`);
