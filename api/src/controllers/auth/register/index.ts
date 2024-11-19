import User, { type IUserWrite } from "@m/User";
import { APIError, type TypedRequest } from "@u";
import type { Response } from "express";
import jwt from "jsonwebtoken";

export const register = async (
	req: TypedRequest<IUserWrite>,
	res: Response,
) => {
	try {
		const user = new User(req.body);
		await user.save();
		
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
			expiresIn: "1h",
		});

		res.json({ token });
	} catch (error) {
    console.log(error);
    
		APIError.handleError(res, error);
	}
};
