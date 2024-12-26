import type { PaginatedResponse } from "@cl/src/base";
import { BaseAPI } from "@cl/src/base";
import type { ITagRead, ITagWrite } from "@m/Tag";

export class Tags extends BaseAPI {
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
