import auth from "@mw/auth";
import authRouter from "@r/api/auth/router";
import noteRouter from "@r/api/note/router";
import tagRouter from "@r/api/tag/router";
import taskRouter from "@r/api/task/router";
import { Router } from "express";

const router = Router();

router.use("/notes", auth, noteRouter);
router.use("/tasks", auth, taskRouter);
router.use("/tags", auth, tagRouter);
router.use("/auth", authRouter);

export default router;
