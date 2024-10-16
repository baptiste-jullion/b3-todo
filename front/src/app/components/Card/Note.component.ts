import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
	MatCard,
	MatCardContent,
	MatCardSubtitle,
	MatCardTitle,
	MatCardTitleGroup,
} from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import type { Note as NoteType } from "@b3-todo/api";
// biome-ignore lint/style/useImportType: <explanation>
import { NoteService } from "@s/Note.service";

@Component({
	standalone: true,
	selector: "note",
	styles: ":host { display: contents; }",
	imports: [
		MatCard,
		MatCardTitleGroup,
		MatCardTitle,
		MatCardSubtitle,
		MatCardContent,
		MatButtonModule,
		MatIcon,
	],
	templateUrl: "Note.component.html",
})
export class Note {
	@Input() note!: NoteType;

	@Output() noteDeleted = new EventEmitter<void>();

	constructor(private noteService: NoteService) {}

	async deleteTask(id: string) {
		await this.noteService.deleteNote(id);
		this.noteDeleted.emit();
	}
}
