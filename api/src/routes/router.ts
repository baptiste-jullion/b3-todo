import noteRouter from "@r/note/router";
import tagRouter from "@r/tag/router";
import taskRouter from "@r/task/router";
import { Router } from "express";

const router = Router();

router.use("/notes", noteRouter);
router.use("/tasks", taskRouter);
router.use("/tags", tagRouter);

export default router;
