import type { INoteRead, INoteWrite } from "@b3-todo/api";
import qs from "qs";
import {
	BaseAPI,
	type PaginatedResponse,
	type PaginationParams,
} from "../../src/base";

export class Notes extends BaseAPI {
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
