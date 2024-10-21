import { Router } from "express";
import {
	createNote,
	deleteNote,
	getNoteById,
	getNotes,
	updateNote,
} from "@c/note";

const router = Router();

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
