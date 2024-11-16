import mongoose, { Schema } from "mongoose";

export interface ITagRead {
	_id: mongoose.Types.ObjectId;
	title: string;
	__v: number;
}

export type ITagWrite = Omit<ITagRead, "_id" | "__v">;

const TagSchema: Schema = new Schema({
	title: { type: String, required: true, unique: true },
});

const Tag = mongoose.model<ITagRead>("Tag", TagSchema);
export default Tag;
