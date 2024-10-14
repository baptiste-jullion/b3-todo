import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Note } from "./components/Card/Note.component";
import { CreateNote } from "./components/Input/CreateNote.component";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, CreateNote, Note, CommonModule],
	templateUrl: "./app.component.html",
})
export class AppComponent {
	notes: {
		title: string;
		content: string;
	}[] = [];

	loadNotes() {
		this.notes = JSON.parse(localStorage.getItem("notes") || "[]");
	}

	ngOnInit() {
		this.loadNotes();
	}
}
