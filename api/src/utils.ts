import type { IUserRead } from "@m/User";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import qs from "qs";
import { v4 as uuid } from "uuid";

export function parsePaginationInfosFromRequest(req: Request) {
	const page = Number.parseInt(req.query.page as string) || 1;
	const limit = Number.parseInt(req.query.limit as string) || 10;

	if (limit < 0 || page < 1)
		throw new APIError(
			400,
			"Invalid pagination parameters. Allowed values are limit >= 0 and page >= 1",
		);

	return {
		page,
		limit,
	};
}

export function parseSelectedFieldsFromRequest(req: Request) {
	const fields = req.query.fields;
	return typeof fields === "string" ? fields.split(",").join(" ") : "";
}

export function parseFilterFromRequest(req: Request) {
	const filter = req.query.filter;

	if (!filter) return {};

	const filterObject =
		typeof filter === "string"
			? qs.parse(filter)
			: (filter as Record<string, unknown>);

	if (filterObject.outdated) {
		if (filterObject.outdated === "true") {
			filterObject.dueDate = { $lt: Date.now() };
		} else if (filterObject.outdated === "false") {
			filterObject.dueDate = { $gte: Date.now() };
		}
		filterObject.outdated = undefined;
	}

	return filterObject;
}

export class APIError {
	status: number;
	message: string;

	constructor(status: number, message?: string) {
		this.status = status;
		this.message = message || APIError.defaultMessage(status);
	}

	static defaultMessage(status: number) {
		switch (status) {
			case 400:
				return "Bad Request";
			case 401:
				return "Unauthorized";
			case 403:
				return "Forbidden";
			case 404:
				return "Not Found";
			case 500:
				return "Internal Server Error";
			default:
				return "An error occurred";
		}
	}

	static handleError(res: Response, error: APIError | unknown) {
		if (error instanceof APIError) {
			res.status(error.status).json({ error: error.message });
			return;
		}
		res.status(500).json({ error });
	}
}

export function saveBase64Image(base64String?: string | null): string | null {
	if (!base64String) return null;
	const matches = base64String.match(/^data:(.+);base64,(.+)$/);
	if (!matches) throw new Error("Invalid Base64 string");

	const fileType = matches[1].split("/")[1];
	const buffer = Buffer.from(matches[2], "base64");

	const uploadPath = path.join(__dirname, "../uploads");
	if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

	const fname = `${Date.now()}-${uuid()}`;

	const filePath = path.join(uploadPath, `${fname}.${fileType}`);
	fs.writeFileSync(filePath, new Uint8Array(buffer));

	return `${fname}.${fileType}`;
}

export interface TypedRequest<
	Body = never,
	Params extends ParamsDictionary = ParamsDictionary,
> extends Request {
	body: Body;
	params: Params;
}

export interface AuthenticatedRequest<
	Body = never,
	Params extends ParamsDictionary = ParamsDictionary,
> extends TypedRequest<Body, Params> {
	userId: string;
}

export function checkEnvVars(...vars: string[]) {
	const missingVars = vars.filter((v) => !process.env[v]);
	if (missingVars.length) {
		throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
	}

	console.log("All environment variables are set");
}

export function generateToken(
	user: IUserRead,
	type: "access" | "refresh" = "access",
) {
	return jwt.sign(
		{ id: user._id },
		type === "access"
			? process.env.JWT_ACCESS_SECRET
			: process.env.JWT_REFRESH_SECRET,
		{
			expiresIn: type === "access" ? "15m" : "7d",
		},
	);
}
