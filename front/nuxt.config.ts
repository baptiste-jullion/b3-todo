// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	css: ["~/assets/css/tailwind.css"],
	modules: ["@nuxtjs/tailwindcss", "nuxtjs-naive-ui"],
	imports: {
		autoImport: false,
	},
	runtimeConfig: {
		public: {
			API_BASE_URL: "http://localhost:54321/api",
			UPLOADS_BASE_URL: "http://localhost:54321/uploads",
		},
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});
