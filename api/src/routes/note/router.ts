import {
	createNote,
	deleteNote,
	getNoteById,
	getNotes,
	updateNote,
} from "@c/note";
import { Router } from "express";

const router = Router();

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
