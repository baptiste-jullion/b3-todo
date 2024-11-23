import { login } from "@c/auth/login";
import { register } from "@c/auth/register";
import User from "@m/User";

import { Router } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);

if (process.env.NODE_ENV === "development") {
	router.get("/users", async (_req, res) => {
		const users = await User.find();
		res.json(users);
	});

  router.delete("/users", async (req, res) => {
    const {ids}= req.body;

    await User.deleteMany({_id: {$in: ids}});

    res.json({message: "Users deleted"});
  })

}

export default router;
