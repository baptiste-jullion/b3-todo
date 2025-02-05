import { useNuxtApp } from "#app";
import type {
	APIResponseError,
	APIResponseSuccess,
} from "@b3-todo/api-sdk/src/base";
import useAuth from "~/composables/useAuth";

export default function useApi() {
	const { $api } = useNuxtApp();
	const { disconnect } = useAuth();

	const handleAPIResponse = async <T>(
		response: APIResponseSuccess<T> | APIResponseError,
	) => {
		if (response.success) return response.data;

		switch (response.response.status) {
			case 401:
				await disconnect();
				break;
		}

		throw new Error(response.error);
	};

	return {
		api: $api,
		handleAPIResponse,
	};
}
