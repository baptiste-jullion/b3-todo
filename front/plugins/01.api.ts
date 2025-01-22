import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import { API } from "@b3-todo/api-sdk";

export default defineNuxtPlugin({
	name: "api",
	setup: () => {
		return {
			provide: {
				api: new API(useRuntimeConfig().public.API_BASE_URL),
			},
		};
	},
});
