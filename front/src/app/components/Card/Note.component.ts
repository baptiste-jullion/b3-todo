import { Component, Input } from "@angular/core";
import {
	MatCard,
	MatCardSubtitle,
	MatCardTitle,
	MatCardTitleGroup,
    MatCardContent
} from "@angular/material/card";

@Component({
	standalone: true,
	selector: "note",
	styles: ":host { display: contents; }",
	imports: [MatCard, MatCardTitleGroup, MatCardTitle, MatCardSubtitle, MatCardContent],
	templateUrl: "./Note.component.html",
})
export class Note {
	@Input() title!: string;
	@Input() content!: string;
}
