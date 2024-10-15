// biome-ignore lint/style/useImportType: <explanation>
import { CdkTextareaAutosize, TextFieldModule } from "@angular/cdk/text-field";
import { CommonModule } from "@angular/common";
import {
	Component,
	EventEmitter,
	Injector,
	Output,
	ViewChild,
	afterNextRender,
	inject,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
// biome-ignore lint/style/useImportType: <explanation>
import { NoteService } from "../../services/Note.service";
import { ReminderDialog } from "./ReminderDialog.component";

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
		TextFieldModule,
		MatMenuModule,
		CommonModule,
		MatDatepickerModule,
	],
	templateUrl: "./CreateNote.component.html",
})
export class CreateNote {
	private _injector = inject(Injector);
	readonly dialog = inject(MatDialog);

	@ViewChild("autosize")
	autosize!: CdkTextareaAutosize;

	triggerResize() {
		afterNextRender(
			() => {
				this.autosize.resizeToFitContent(true);
			},
			{
				injector: this._injector,
			},
		);
	}

	title = "";
	description = "";
	displayFullCard = false;
	backgroundColor = "";
	date: Date | null = null;

	colors = [
		["Rose", "!text-rose-700", "!bg-rose-100"],
		["Violet", "!text-violet-700", "!bg-violet-100"],
		["Cyan", "!text-cyan-700", "!bg-cyan-100"],
		["Teal", "!text-teal-700", "!bg-teal-100"],
		["Amber", "!text-amber-700", "!bg-amber-100"],
		["Stone", "!text-stone-700", "!bg-stone-100"],
		["Slate", "!text-slate-700", "!bg-slate-100"],
	];

	@Output() noteCreated = new EventEmitter<void>();

	constructor(private noteService: NoteService) {}

	handleFocus() {
		this.displayFullCard = true;
	}

	handleBlur() {
		if (!this.title && !this.description) {
			this.displayFullCard = false;
		}
	}

	toggleBackgroundColor(color: string) {
		if (this.backgroundColor === color) {
			this.backgroundColor = "";
			return;
		}
		this.backgroundColor = color;
	}

	async handleNoteCreation() {
		if (!this.title) return;
		await this.noteService.addNote({
			title: this.title,
			description: this.description,
			backgroundColor: this.backgroundColor,
			endDate: {
				date: this.date?.getDate() ?? 0,
				hour: this.date?.getHours() ?? 0,
				minute: this.date?.getMinutes() ?? 0,
			},
		});
		this.resetNote();
		this.noteCreated.emit();
	}

	resetNote() {
		this.title = "";
		this.description = "";
		this.backgroundColor = "";
		this.date = null;
		this.displayFullCard = false;
	}

	openReminderDialog() {
		const dialogRef = this.dialog.open(ReminderDialog, {
			data: {},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result !== undefined) {
				console.log(result);
			}
		});
	}
}
