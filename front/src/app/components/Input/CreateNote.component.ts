import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";

interface Note {
	title: string;
	content: string;
}

@Component({
	standalone: true,
	selector: "create-note",
	styles: ":host { display: contents; }",
	imports: [
		FormsModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
	],
	templateUrl: "./CreateNote.component.html",
})
export class CreateNote {
	value = "";
	handleNoteCreation(mode: "basic" | "list" | "image") {
		const notes: Note[] = JSON.parse(localStorage.getItem("notes") || "[]");

		switch (mode) {
			case "basic":
				notes.push({ title: "New Note", content: this.value });
				break;
			case "list":
				console.log("Tkt je gère");
				break;
			case "image":
				console.log("Tkt je gère");
				break;
		}

		localStorage.setItem("notes", JSON.stringify(notes));
	}
}
