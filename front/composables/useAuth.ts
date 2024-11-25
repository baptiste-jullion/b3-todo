import { navigateTo, useCookie, useRuntimeConfig } from "#app";
import useApi from "~/composables/useApi";

export default function useAuth() {
	
		const clearToken = () => {
			const { JWT_COOKIE_NAME } = useRuntimeConfig().public;
			const token = useCookie(JWT_COOKIE_NAME);
			token.value = "";
		}
	
	const disconnect = async () => {
		const { api } = useApi();
		await api.auth.logout();
		clearToken();
		navigateTo("/auth");
	};

	return {
		disconnect,
		clearToken,
	};
}
