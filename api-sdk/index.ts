import { Auth } from "./src/auth";
import { BaseAPI } from "./src/base";
import { Notes } from "./src/notes";
import { Tags } from "./src/tags";

export * from "@b3-todo/api";

export class API extends BaseAPI {
	public notes: Notes;
	public tags: Tags;
	public auth: Auth;

	constructor(baseUrl: string) {
		super(baseUrl);
		this.notes = new Notes(this.API_BASE_URL);
		this.tags = new Tags(this.API_BASE_URL);
		this.auth = new Auth(this.API_BASE_URL);
	}
}
