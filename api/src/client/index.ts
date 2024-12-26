import { Auth } from "@cl/src/auth";
import { BaseAPI } from "@cl/src/base";
import { Notes } from "@cl/src/notes";
import { Tags } from "@cl/src/tags";

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
