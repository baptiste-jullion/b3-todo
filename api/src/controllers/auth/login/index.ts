import User from "@m/User";
import { APIError, type TypedRequest } from "@u";
import argon from "argon2";
import type { Response } from "express";
import jwt from "jsonwebtoken";

export const login = async (
	req: TypedRequest<{
		email: string;
		password: string;
	}>,
	res: Response,
) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			throw new APIError(404, "Email or password is invalid");
		}

		const isPasswordValid = await argon.verify(user.password, password);

		if (!isPasswordValid) {
			throw new APIError(404, "Email or password is invalid");
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
			expiresIn: "1h",
		});

		res.json({ token });
	} catch (error) {
		APIError.handleError(res, error);
	}
};
