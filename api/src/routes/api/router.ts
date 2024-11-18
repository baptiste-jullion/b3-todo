import noteRouter from "@r/api/note/router";
import tagRouter from "@r/api/tag/router";
import taskRouter from "@r/api/task/router";
import { Router } from "express";

const router = Router();

router.use("/notes", noteRouter);
router.use("/tasks", taskRouter);
router.use("/tags", tagRouter);

export default router;
