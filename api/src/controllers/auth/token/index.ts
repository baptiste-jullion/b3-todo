import User from "@m/User";
import { APIError } from "@u";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verify = async (req: Request, res: Response) => {
	try {
		if (!req.headers.authorization?.startsWith("Bearer"))
			throw new APIError(401);

		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string,
		) as jwt.JwtPayload;

		const user = await User.findById(decoded.id);

		if (!user) throw new APIError(401);

		res.status(200).json(user._id);
	} catch (err) {
		APIError.handleError(res, err);
	}
};
