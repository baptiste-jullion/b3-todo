import type { ITaskRead } from "@b3-todo/api";
import { BaseAPI } from "../../../src/base";

export class Tasks extends BaseAPI {
	public async complete(id: ITaskRead["_id"]) {
		return await this.fetchApi<ITaskRead>(`/tasks/${id}/complete`, {
			method: "PATCH",
		});
	}
	public async uncomplete(id: ITaskRead["_id"]) {
		return await this.fetchApi<ITaskRead>(`/tasks/${id}/uncomplete`, {
			method: "PATCH",
		});
	}
}
