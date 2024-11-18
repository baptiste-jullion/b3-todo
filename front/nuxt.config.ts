export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	css: ["~/assets/css/tailwind.css"],
	modules: ["@nuxtjs/tailwindcss", "nuxtjs-naive-ui"],
	imports: {
		autoImport: false,
	},
	devServer: {
		port: (process.env.FRONT_PORT as number | undefined) || 3000,
	},
	runtimeConfig: {
		public: {
			API_BASE_URL: `http://${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_BASE_ROUTE}`,
			UPLOADS_BASE_URL: `http://${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_UPLOADS_ROUTE}`,
		},
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});
