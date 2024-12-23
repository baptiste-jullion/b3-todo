import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to) => {
	const accessToken = localStorage.getItem("access-token");

	if (to.path === "/auth" && accessToken) return navigateTo("/");

	if (to.path === "/auth") return;

	if (!accessToken) return navigateTo("/auth");
});
