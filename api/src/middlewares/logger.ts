import type { NextFunction, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

export function logger(
	req: Request & {
		userId?: string;
	},
	res: Response,
	next: NextFunction,
) {
	res.on("finish", () => {
		const method = req.method.padEnd(6, " ");
		const statusCode = res.statusCode.toString().padEnd(3, " ");
		const url = req.originalUrl;
		const date = new Date().toISOString();

		const log = `${date} ${method} ${statusCode} ${req.userId || 'Anonymous               '} ${url} `;
		const logsFolder = path.join(__dirname, "../../logs");

		if (!fs.existsSync(logsFolder)) {
			fs.mkdirSync(logsFolder);
		}

		const file = path.join(
			logsFolder,
			`${new Date().toISOString().split("T")[0]}.log`,
		);

		if (!fs.existsSync(file)) {
			fs.writeFileSync(file, "");
		}

		fs.appendFileSync(file, `${log}\n`);
	});
	next();
}
