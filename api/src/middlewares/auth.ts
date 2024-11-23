import User from "@m/User";
import { APIError } from "@u";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async (
	req: Request & { userId?: string },
	res: Response,
	next: NextFunction,
) => {
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

		req.userId = user._id;

		next();
	} catch (err) {
		let error = err;
		if (err instanceof jwt.JsonWebTokenError) {
			error = new APIError(401);
		}
		APIError.handleError(res, error);
	}
};
