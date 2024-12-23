import User, { type IUserWrite } from "@m/User";
import { APIError, type TypedRequest, generateToken } from "@u";
import type { Response } from "express";

export const register = async (
	req: TypedRequest<IUserWrite>,
	res: Response,
) => {
	try {
		const user = new User(req.body);
		await user.save();

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
