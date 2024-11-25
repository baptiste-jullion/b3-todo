import {
	defineNuxtRouteMiddleware,
	navigateTo,
	useCookie,
	useRuntimeConfig,
} from "#app";

export default defineNuxtRouteMiddleware((to) => {
	

	const { JWT_COOKIE_NAME } = useRuntimeConfig().public;

	const token = useCookie(JWT_COOKIE_NAME);

	if (to.path === "/auth" && token.value) return navigateTo("/");

	if (to.path === "/auth") return;

	if (!token.value) return navigateTo("/auth");
});
