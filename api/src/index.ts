import { connectDB } from "@db/index";
import router from "@r/router";
import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { logger } from "@md/logger";

connectDB();

const uploadsFolder = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsFolder)) {
	fs.mkdirSync(uploadsFolder);
}

const port = process.env.API_PORT;

if (!port) {
	console.error("API_PORT is missing");
	process.exit(1);
}

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(logger);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", router);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
