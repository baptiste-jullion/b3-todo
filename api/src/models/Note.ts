import mongoose, { Schema } from "mongoose";

export interface INote {
	_id: mongoose.Types.ObjectId;
	title: string;
	description: string;
	cover?: Buffer;
	tasks?: mongoose.Types.ObjectId[];
	background?: string;
	dueDate?: Date;
}

const NoteSchema: Schema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	cover: { type: Buffer },
	tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
	background: { type: String },
	dueDate: { type: Date },
});

const Note = mongoose.model<INote>("Note", NoteSchema);
export default Note;
