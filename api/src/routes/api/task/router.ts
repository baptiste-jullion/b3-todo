import { Router } from "express";
import {
	createTask,
	deleteTask,
	getTaskById,
	getTasks,
	updateTask,
} from "@c/task";

const router = Router();

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
