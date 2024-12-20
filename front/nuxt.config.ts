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
			API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL,
			UPLOADS_BASE_URL: process.env.NUXT_PUBLIC_UPLOADS_BASE_URL,
		},
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	build: {
		transpile:
			process.env.NODE_ENV === "production"
				? ["naive-ui", "vueuc", "@css-render/vue3-ssr"]
				: [],
	},
});
