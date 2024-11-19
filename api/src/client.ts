import type { INoteRead, INoteWrite } from "@m/Note";
import type { ITagRead, ITagWrite } from "@m/Tag";
import qs from "qs";

interface PaginationParams {
	limit: number;
	page: number;
}

interface PaginatedResponse<T> {
	count: number;
	has_next: boolean;
	has_previous: boolean;
	results: T[];
}

interface APIResponseSuccess<T> {
	success: true;
	data: T;
}

interface APIResponseError {
	success: false;
	error: string;
}

class BaseAPI {
	protected API_BASE_URL: string;
	constructor(baseUrl: string) {
		this.API_BASE_URL = baseUrl;
	}

	protected async fetchApi<T>(
		url: string,
		options: RequestInit & { query?: URLSearchParams } = {},
	) {
		const response = await fetch(
			`${this.API_BASE_URL}${url}${options.query ? `?${options.query.toString()}` : ""}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
				...options,
			},
		);

		if (!response.ok) {
			return {
				success: false,
				error: `Request failed with status ${response.status}: ${await response.text()}`,
			} as APIResponseError;
		}

		const data = await response.json();

		return {
			success: true,
			data,
		} as APIResponseSuccess<T>;
	}
}

class Notes extends BaseAPI {
	public async list<T extends keyof INoteRead>(
		options?: Partial<{
			fields?: T[];
			pagination?: Partial<PaginationParams>;
			filter: Record<string, unknown>;
		}>,
	) {
		const query = new URLSearchParams();

		options?.fields && query.set("fields", options.fields.join(","));
		options?.pagination?.limit &&
			query.set("limit", options.pagination.limit.toString());
		options?.pagination?.page &&
			query.set("page", options.pagination.page.toString());
		options?.filter && query.set("filter", qs.stringify(options.filter));

		return await this.fetchApi<PaginatedResponse<Pick<INoteRead, T>>>(
			"/notes",
			{ query },
		);
	}

	public async get(id: INoteRead["_id"]) {
		return await this.fetchApi<INoteRead>(`/notes/${id.toString()}`);
	}

	public async create(note: INoteWrite) {
		return await this.fetchApi<INoteRead>("/notes", {
			method: "POST",
			body: JSON.stringify(note),
		});
	}

	public async delete(id: INoteRead["_id"]) {
		return await this.fetchApi<INoteRead>(`/notes/${id}`, {
			method: "DELETE",
		});
	}

	public async update(id: INoteRead["_id"], note: Partial<INoteWrite>) {
		return await this.fetchApi<INoteRead>(`/notes/${id}`, {
			method: "PUT",
			body: JSON.stringify(note),
		});
	}
}

class Tags extends BaseAPI {
	public async list() {
		return await this.fetchApi<PaginatedResponse<ITagRead>>("/tags");
	}

	public async get(id: ITagRead["_id"]) {
		return await this.fetchApi<ITagRead>(`/tags/${id}`);
	}

	public async create(tag: ITagWrite) {
		return await this.fetchApi<ITagRead>("/tags", {
			method: "POST",
			body: JSON.stringify(tag),
		});
	}
}

class Auth extends BaseAPI {
	public async login(username: string, password: string) {
		return await this.fetchApi<{ token: string }>("/auth/login", {
			method: "POST",
			body: JSON.stringify({ username, password }),
		});
	}

	public async register(username: string, password: string) {
		return await this.fetchApi<{ token: string }>("/auth/register", {
			method: "POST",
			body: JSON.stringify({ username, password }),
		});
	}
}

export class API extends BaseAPI {
	public notes = new Notes(this.API_BASE_URL);
	public tags = new Tags(this.API_BASE_URL);
	public auth = new Auth(this.API_BASE_URL);
}
