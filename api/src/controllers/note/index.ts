import Note from "@m/Note";
import {
	APIError,
	parseFilterFromRequest,
	parsePaginationInfosFromRequest,
	parseSelectedFieldsFromRequest,
	saveBase64Image,
} from "@u";
import type { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

export const getNotes = async (req: Request, res: Response) => {
	try {
		const fields = parseSelectedFieldsFromRequest(req);
		const { limit, page } = parsePaginationInfosFromRequest(req);
		const filter = parseFilterFromRequest(req);

		if (limit < 0 || page < 1)
			throw new APIError(
				400,
				"Invalid pagination parameters. Allowed values are limit >= 0 and page >= 1",
			);

		const count = await Note.countDocuments(filter);

		if (count === 0 || (page - 1) * limit >= count) throw new APIError(404);

		const notes = await Note.find(filter, fields)
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ updatedAt: -1 });

		res.json({
			count,
			has_previous: page > 1,
			has_next: (page - 1) * limit + notes.length < count,
			results: notes,
		});
	} catch (error) {
		APIError.handleError(res, error);
	}
};

export const getNoteById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const note = await Note.findById(id);
		if (!note) throw new APIError(404);
		res.json(note);
	} catch (error) {
		APIError.handleError(res, error);
	}
};

export const createNote = async (req: Request, res: Response) => {
	try {
		req.body.cover = saveBase64Image(req.body.cover);
		const note = new Note(req.body);
		await note.save();
		res.status(201).json(note);
	} catch (error) {
		res.status(400).json({ message: "Invalid note" });
	}
};

export const updateNote = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const note = await Note.findByIdAndUpdate(id, req.body, { new: true });
		res.json(note);
	} catch (error) {
		res.status(404).json({ message: "Note not found" });
	}
};

export const deleteNote = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const note = await Note.findByIdAndDelete(id);
		if (note?.cover) {
			fs.unlinkSync(path.join(__dirname, `../../../uploads/${note.cover}`));
		}
		res.json({ message: "Note deleted" });
	} catch (error) {
		res.status(404).json({ message: "Note not found" });
	}
};
