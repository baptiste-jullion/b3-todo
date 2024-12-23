import { connectDB } from "@db/index";
import { logger } from "@mw/logger";
import apiRouter from "@r/api/router";
import { checkEnvVars } from "@u";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";

checkEnvVars(
	"MONGO_URI",
	"API_PORT",
	"API_HOST",
	"API_BASE_ROUTE",
	"API_UPLOADS_ROUTE",
	"API_PROTOCOL",
	"JWT_ACCESS_SECRET",
	"JWT_REFRESH_SECRET",
);

connectDB();

const uploadsFolder = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsFolder)) {
	fs.mkdirSync(uploadsFolder);
}

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(
	cors({
		origin: "http://localhost:12345",
		credentials: true,
	}),
);
app.use(logger);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", apiRouter);

app.use((_req, res) => {
	res.status(404).json({ error: "Not Found" });
});

app.listen(process.env.API_PORT, () => {
	console.log(`Server is running on http://localhost:${process.env.API_PORT}`);
});
