import mongoose, { Schema } from "mongoose";

export interface ITask {
	_id: mongoose.Types.ObjectId;
	label: string;
	completed: boolean;
	note: mongoose.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
	label: { type: String, required: true },
	completed: { type: Boolean, default: false },
	note: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true },
});

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
