export type { INoteRead, INoteWrite } from "@m/Note";
export type { ITagRead, ITagWrite } from "@m/Tag";
export type { ITaskRead, ITaskWrite } from "@m/Task";
export type { IUserRead, IUserWrite } from "@m/User";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			MONGO_URI: string;
			API_PORT: string;
			API_HOST: string;
			API_BASE_ROUTE: string;
			API_UPLOADS_ROUTE: string;
			API_PROTOCOL: string;
			JWT_ACCESS_SECRET: string;
			JWT_REFRESH_SECRET: string;
			PORT: string;
			NUXT_PUBLIC_UPLOADS_BASE_URL: string;
			NUXT_PUBLIC_API_BASE_URL: string;
		}
	}
}
