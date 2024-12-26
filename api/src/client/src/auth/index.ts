import { BaseAPI } from "@cl/src/base";
import type { IUserWrite } from "@m/User";

export class Auth extends BaseAPI {
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
