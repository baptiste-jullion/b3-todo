import type { INoteRead, INoteWrite } from "@m/Note";
import type { ITagRead, ITagWrite } from "@m/Tag";
import type { IUserWrite } from "@m/User";
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
	response: Response;
}

class BaseAPI {
	protected API_BASE_URL: string;
	protected headers: Headers;

	constructor(baseUrl: string, headers?: Headers) {
		this.API_BASE_URL = baseUrl;
		this.headers =
			headers || new Headers({ "Content-Type": "application/json" });
	}

	protected async fetchApi<T>(
		url: string,
		options: RequestInit & { query?: URLSearchParams } = {},
	) {
		const response = await fetch(
			`${this.API_BASE_URL}${url}${options.query ? `?${options.query.toString()}` : ""}`,
			{
				headers: this.headers,
				...options,
			},
		);

		if (!response.ok) {
			return {
				success: false,
				error: `Request failed with status ${response.status}: ${await response.text()}`,
				response,
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
	public async login(user: Pick<IUserWrite, "username" | "password">) {
		const res = await this.fetchApi<{ token: string }>("/auth/login", {
			method: "POST",
			body: JSON.stringify(user),
		});

		if (!res.success) return res;

		this.headers.set("Authorization", `Bearer ${res.data.token}`);

		return res;
	}

	public async register(user: IUserWrite) {
		const res = await this.fetchApi<{ token: string }>("/auth/register", {
			method: "POST",
			body: JSON.stringify(user),
		});

		if (!res.success) return res;

		this.headers.set("Authorization", `Bearer ${res.data.token}`);

		return res;
	}

	public async logout() {
		this.headers.delete("Authorization");
		return { success: true };
	}

	public async injectToken(token: string) {
		this.headers.set("Authorization", `Bearer ${token}`);
	}
}

export class API extends BaseAPI {
	public notes: Notes;
	public tags: Tags;
	public auth: Auth;

	constructor(baseUrl: string) {
		super(baseUrl);
		this.notes = new Notes(this.API_BASE_URL, this.headers);
		this.tags = new Tags(this.API_BASE_URL, this.headers);
		this.auth = new Auth(this.API_BASE_URL, this.headers);
	}
}
