import { login } from "@c/auth/login";
import { register } from "@c/auth/register";

import { Router } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
