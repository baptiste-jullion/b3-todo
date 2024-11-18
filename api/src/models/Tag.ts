import mongoose, { Schema } from "mongoose";

export interface ITagRead {
	_id: mongoose.Types.ObjectId;
	title: string;
}

export type ITagWrite = Omit<ITagRead, "_id">;

const TagSchema: Schema = new Schema(
	{
		title: { type: String, required: true, unique: true },
	},
	{
		versionKey: false,
	},
);

const Tag = mongoose.model<ITagRead>("Tag", TagSchema);
export default Tag;
