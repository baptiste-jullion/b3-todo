import { connectDB } from "@db/index";
import router from "@r/router";
import cors from "cors";
import express from "express";

connectDB();

const port = process.env.API_PORT;

if (!port) {
	console.error("API_PORT is missing");
	process.exit(1);
}

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.use("/api", router);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
