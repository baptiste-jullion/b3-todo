import { login } from "@c/auth/login";
import { register } from "@c/auth/register";
import { verify } from "@c/auth/token";

import { Router } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-token", verify);

export default router;
