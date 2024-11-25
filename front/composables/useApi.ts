import { useCookie, useNuxtApp, useRuntimeConfig } from "#app";

export default function useApi() {
	const { $api } = useNuxtApp();
	const cookie = useCookie(useRuntimeConfig().public.JWT_COOKIE_NAME);
	cookie.value && $api.auth.injectToken(cookie.value);
	return {
		api: $api,
	};
}
