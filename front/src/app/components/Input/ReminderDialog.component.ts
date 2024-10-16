import { Component, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

export interface Reminder {
	date: Date;
	hour: number;
	minute: number;
}

@Component({
	selector: "reminder-dialog",
	templateUrl: "ReminderDialog.component.html",
	standalone: true,
	providers: [provideNativeDateAdapter()],
	imports: [
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatButtonModule,
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
		MatIconModule,
		MatDatepickerModule,
	],
})
export class ReminderDialog {
	readonly dialogRef = inject(MatDialogRef<ReminderDialog>);
	readonly data = inject<Reminder>(MAT_DIALOG_DATA);
	readonly date = model<Reminder["date"]>();
	readonly hour = model<Reminder["hour"]>();
	readonly minute = model<Reminder["minute"]>();

	onNoClick(): void {
		this.dialogRef.close();
	}
}
