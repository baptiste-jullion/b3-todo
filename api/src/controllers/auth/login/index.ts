import User from "@m/User";
import { APIError, type TypedRequest, generateToken } from "@u";
import argon from "argon2";
import type { Response } from "express";

export const login = async (
	req: TypedRequest<{
		email: string;
		password: string;
	}>,
	res: Response,
) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({
			email: {
				$regex: email,
				$options: "i",
			},
		});
		if (!user) {
			throw new APIError(404, "Email or password is invalid");
		}

		const isPasswordValid = await argon.verify(user.password, password);

		if (!isPasswordValid) {
			throw new APIError(404, "Email or password is invalid");
		}

		res.cookie("refreshToken", generateToken(user, "refresh"), {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
		});

		res.json({ token: generateToken(user) });
	} catch (error) {
		APIError.handleError(res, error);
	}
};
