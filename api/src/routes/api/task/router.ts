import { Router } from "express";
import {
	createTask,
	deleteTask,
	getTaskById,
	getTasks,
	updateTask,
	completeTask,
	uncompleteTask,
} from "@c/task";

const router = Router();

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/complete", completeTask);
router.patch("/:id/uncomplete", uncompleteTask);

export default router;
