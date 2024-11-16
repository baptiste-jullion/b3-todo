import type { ITagRead } from "@m/Tag";
import mongoose, { Schema } from "mongoose";

export interface INoteRead {
	__v: number;
	_id: string;
	cover?: string | null;
	createdAt: Date;
	description: string;
	dueDate?: number;
	state?: "todo" | "in_progress" | "completed";
	tags?: ITagRead[];
	tasks?: string[];
	title: string;
	updatedAt: Date;
}

export type INoteWrite = Omit<
	INoteRead,
	"_id" | "createdAt" | "updatedAt" | "__v" | "tags"
> & {
	tags?: string[];
};

const NoteSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		cover: { type: String },
		tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
		tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
		dueDate: { type: Number },
		state: {
			type: String,
			enum: ["todo", "in_progress", "completed"],
			default: "todo",
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
	},
);

NoteSchema.pre("findOne", function (next) {
	this.populate("tags");
	next();
});

NoteSchema.pre("find", function (next) {
	this.populate("tags");
	next();
});

const Note = mongoose.model<INoteRead>("Note", NoteSchema);
export default Note;
