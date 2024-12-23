import type { INoteRead, INoteWrite } from "@m/Note";
import type { ITagRead, ITagWrite } from "@m/Tag";
import type { IUserWrite } from "@m/User";
import qs from "qs";

interface PaginationParams {
	limit: number;
	page: number;
}

export interface PaginatedResponse<T> {
	count: number;
	has_next: boolean;
	has_previous: boolean;
	results: T[];
}

export interface APIResponseSuccess<T> {
	success: true;
	data: T;
}

export interface APIResponseError {
	success: false;
	error: string;
	response: Response;
}

class BaseAPI {
	protected API_BASE_URL: string;
	protected headers: Headers;

	constructor(baseUrl: string) {
		this.API_BASE_URL = baseUrl;
		this.headers = new Headers({ "Content-Type": "application/json" });
	}

	protected async fetchApi<T>(
		url: string,
		options: RequestInit & { query?: URLSearchParams } = {},
	) {
		const token = localStorage.getItem("access-token");
		if (token) this.headers.set("Authorization", `Bearer ${token}`);

		let response = await fetch(
			`${this.API_BASE_URL}${url}${options.query ? `?${options.query.toString()}` : ""}`,
			{
				headers: this.headers,
				credentials: "include",
				...options,
			},
		);

		if (response.status === 401) {
			const refreshResponse = await this.refreshToken();

			const token = localStorage.getItem("access-token");
			if (token) this.headers.set("Authorization", `Bearer ${token}`);

			if (refreshResponse.success) {
				response = await fetch(
					`${this.API_BASE_URL}${url}${options.query ? `?${options.query.toString()}` : ""}`,
					{
						headers: this.headers,
						credentials: "include",
						...options,
					},
				);
			}
		}

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

	protected async refreshToken(): Promise<
		APIResponseSuccess<{ token: string }> | APIResponseError
	> {
		const response = await fetch(`${this.API_BASE_URL}/auth/refresh`, {
			method: "POST",
			headers: this.headers,
			credentials: "include",
		});

		if (!response.ok) {
			return {
				success: false,
				error: `Refresh token request failed with status ${response.status}: ${await response.text()}`,
				response,
			} as APIResponseError;
		}

		const data = await response.json();
		localStorage.setItem("access-token", data.token);
		this.headers.set("Authorization", `Bearer ${data.token}`);
		return {
			success: true,
			data,
		} as APIResponseSuccess<{ token: string }>;
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
			credentials: "include",
		});

		if (!res.success) return res;

		localStorage.setItem("access-token", res.data.token);

		return res;
	}

	public async register(user: IUserWrite) {
		const res = await this.fetchApi<{ token: string }>("/auth/register", {
			method: "POST",
			body: JSON.stringify(user),
			credentials: "include",
		});

		if (!res.success) return res;

		localStorage.setItem("access-token", res.data.token);

		return res;
	}

	public async logout() {
		localStorage.removeItem("access-token");
		this.headers.delete("Authorization");
		return { success: true };
	}
}

export class API extends BaseAPI {
	public notes: Notes;
	public tags: Tags;
	public auth: Auth;

	constructor(baseUrl: string) {
		super(baseUrl);
		this.notes = new Notes(this.API_BASE_URL);
		this.tags = new Tags(this.API_BASE_URL);
		this.auth = new Auth(this.API_BASE_URL);
	}
}
