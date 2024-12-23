import User from "@m/User";
import { APIError, type TypedRequest, generateToken } from "@u";
import type { Response } from "express";
import jwt from "jsonwebtoken";

export const refresh = async (req: TypedRequest, res: Response) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (!refreshToken) throw new APIError(401, "No refresh token provided");

		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET,
		) as jwt.JwtPayload;

		const user = await User.findById(decoded.id);

		if (!user) throw new APIError(401, "Invalid refresh token");

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
