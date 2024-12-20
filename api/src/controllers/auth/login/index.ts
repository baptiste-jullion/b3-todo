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
		const user = await User.findOne({ email });
		if (!user) {
			throw new APIError(404, "Email or password is invalid");
		}

		const isPasswordValid = await argon.verify(user.password, password);

		if (!isPasswordValid) {
			throw new APIError(404, "Email or password is invalid");
		}

		res.cookie("refreshToken", generateToken(user, "refresh"), {
			httpOnly: true,
			sameSite: "strict",
			secure: true,
			path: "/auth/refresh",
		});

		res.json({ token: generateToken(user) });
	} catch (error) {
		APIError.handleError(res, error);
	}
};
