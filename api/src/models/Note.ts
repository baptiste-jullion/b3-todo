import type { ITagRead } from "@m/Tag";
import type { ITaskRead, ITaskWrite } from "@m/Task";
import type { IUserRead } from "@m/User";
import mongoose, { Schema } from "mongoose";

export interface INoteRead {
	_id: string;
	cover?: string | null;
	createdAt: Date;
	description: string;
	dueDate?: number;
	state?: "todo" | "in_progress" | "completed";
	tags?: ITagRead[];
	tasks?: ITaskRead[];
	title: string;
	updatedAt: Date;
	author: Omit<IUserRead, "password">;
}

export type INoteWrite = Omit<
	INoteRead,
	"_id" | "createdAt" | "updatedAt" | "tags" | "author" | "tasks"
> & {
	tags?: string[];
	tasks?: ITaskWrite[];
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
		author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

NoteSchema.pre("findOne", function (next) {
	this.populate({
		path: "author tags tasks",
		select: "-password",
	});
	next();
});

NoteSchema.pre("find", function (next) {
	this.populate({
		path: "author tags tasks",
		select: "-password",
	});
	next();
});

const Note = mongoose.model<INoteRead>("Note", NoteSchema);
export default Note;
