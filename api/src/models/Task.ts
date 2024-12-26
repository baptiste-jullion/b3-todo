import type { IUserRead } from "@m/User";
import mongoose, { Schema } from "mongoose";

export interface ITaskRead {
	_id: mongoose.Types.ObjectId;
	label: string;
	completed: boolean;
	completedBy: IUserRead;
}

export type ITaskWrite = string;

const TaskSchema: Schema = new Schema(
	{
		label: { type: String, required: true },
		completed: { type: Boolean, default: false },
		completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{
		versionKey: false,
	},
);

TaskSchema.pre("findOne", function (next) {
	this.populate({
		path: "completedBy",
	});
	next();
});

TaskSchema.pre("find", function (next) {
	this.populate({
		path: "completedBy",
	});
	next();
});

const Task = mongoose.model<ITaskRead>("Task", TaskSchema);
export default Task;
