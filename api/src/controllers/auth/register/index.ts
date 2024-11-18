import User, { type IUserWrite } from "@m/User";
import { APIError, type TypedRequest } from "@u";
import type { Response } from "express";

export const register = async (
	req: TypedRequest<IUserWrite>,
	res: Response,
) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.status(201).json(user);
	} catch (error) {
    console.log(error);
    
		APIError.handleError(res, error);
	}
};
