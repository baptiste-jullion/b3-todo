export interface PaginationParams {
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

export class BaseAPI {
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
