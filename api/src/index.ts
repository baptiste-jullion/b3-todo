import { connectDB } from "@db/index";
import { logger } from "@md/logger";
import apiRouter from "@r/api/router";
import authRouter from "@r/auth/router";
import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";

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

app.use("/api", apiRouter);
app.use("/auth", authRouter);

app.use((_req, res) => {
	res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
