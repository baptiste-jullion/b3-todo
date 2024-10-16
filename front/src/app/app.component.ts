import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import type { Note as NoteType } from "@b3-todo/api";
import { Note } from "./components/Card/Note.component";
import { CreateNote } from "./components/Input/CreateNote.component";
// biome-ignore lint/style/useImportType: <explanation>
import { NoteService } from "./services/Note.service";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [CreateNote, Note, CommonModule],
	templateUrl: "./app.component.html",
})
export class AppComponent {
	notes: NoteType[] = [];

	constructor(private noteService: NoteService) {}

	async ngOnInit() {
		await this.refreshNotes();
	}

	async refreshNotes() {
		this.notes = await this.noteService.getNotes();
	}
}
