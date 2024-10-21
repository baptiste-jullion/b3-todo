import Note from "@m/Note";
import type { Request, Response } from "express";

export const getNotes = async (_req: Request, res: Response) => {
	try {
		const notes = await Note.find();
		res.json(notes);
	} catch (error) {
		res.status(404).json({ message: "Notes not found" });
	}
};

export const getNoteById = async (_req: Request, _res: Response) => {
	try {
		const { id } = _req.params;
		const note = await Note.findById(id);
		_res.json(note);
	} catch (error) {
		_res.status(404).json({ message: "Note not found" });
	}
};

export const createNote = async (_req: Request, _res: Response) => {
	try {
		const note = new Note(_req.body);
		await note.save();
		_res.status(201).json(note);
	} catch (error) {
		_res.status(400).json({ message: "Invalid note" });
	}
};

export const updateNote = async (_req: Request, _res: Response) => {
	try {
		const { id } = _req.params;
		const note = await Note.findByIdAndUpdate(id, _req.body, { new: true });
		_res.json(note);
	} catch (error) {
		_res.status(404).json({ message: "Note not found" });
	}
};

export const deleteNote = async (_req: Request, _res: Response) => {
	try {
		const { id } = _req.params;
		await Note.findByIdAndDelete(id);
		_res.json({ message: "Note deleted" });
	} catch (error) {
		_res.status(404).json({ message: "Note not found" });
	}
};
