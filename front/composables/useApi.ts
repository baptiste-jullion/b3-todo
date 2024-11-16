import { useRuntimeConfig } from "#app";
import { API } from "@b3-todo/api/src/client";

export default function useApi() {
	const { API_BASE_URL } = useRuntimeConfig().public;
	return { client: new API(API_BASE_URL) };
}
