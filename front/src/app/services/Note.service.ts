import { Injectable } from "@angular/core";

import type { Note } from "../../../../shared/types/Note";
export type { Note };

@Injectable({
	providedIn: "root",
})
export class NoteService {
	private apiUrl = "http://localhost:8080/notes";

	async getNotes(): Promise<Note[]> {
		const response = await fetch(this.apiUrl);
		return await response.json();
	}

	async addNote(note: Omit<Note, "id">): Promise<Note> {
		const headers = { "Content-Type": "application/json" };
		const response = await fetch(this.apiUrl, {
			method: "POST",
			headers,
			body: JSON.stringify(note),
		});

		return await response.json();
	}

	async deleteNote(id: string): Promise<void> {
		const url = `${this.apiUrl}/${id}`;
		const response = await fetch(url, { method: "DELETE" });
		return await response.json();
	}
}