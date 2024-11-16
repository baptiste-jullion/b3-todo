import type { Request, Response } from "express";
import qs from "qs";

export function parsePaginationInfosFromRequest(req: Request) {
	const page = Number.parseInt(req.query.page as string) || 1;
	const limit = Number.parseInt(req.query.limit as string) || 10;

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
