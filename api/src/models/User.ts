import argon from "argon2";
import mongoose, { Schema } from "mongoose";

export interface IUserRead {
	_id: string;
	email: string;
	display_name: string;
	password: string;
}

export type IUserWrite = Omit<IUserRead, "_id">;

const UserSchema: Schema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: (v: string) => {
					return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
				},
			},
			max: 320,
		},
		password: {
			type: String,
			required: true,
			max: 100,
		},
		display_name: {
			type: String,
			required: true,
			max: 100,
		},
	},
	{
		versionKey: false,
	},
);

UserSchema.pre("save", async function (next) {
	const user = this as unknown as IUserWrite;
	const hash = await argon.hash(user.password, {
		type: argon.argon2id,
	});
	user.password = hash;
	next();
});

const User = mongoose.model<IUserRead>("User", UserSchema);
export default User;
