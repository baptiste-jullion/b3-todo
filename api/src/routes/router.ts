import { Router } from "express";
import noteRouter from "@r/note/router";
import taskRouter from "@r/task/router";

const router = Router();

router.use("/notes", noteRouter);
router.use("/tasks", taskRouter);

export default router;
