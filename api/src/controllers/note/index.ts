import Note, { type INoteWrite } from "@m/Note";
import Tag, { type ITagWrite } from "@m/Tag";
import {
	APIError,
	type TypedRequest,
	parseFilterFromRequest,
	parsePaginationInfosFromRequest,
	parseSelectedFieldsFromRequest,
	saveBase64Image,
} from "@u";
import type { Response } from "express";
import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";

export const getNotes = async (
	req: TypedRequest<
		never,
		{
			fields?: string;
			limit?: string;
			page?: string;
			filter?: string;
		}
	>,
	res: Response,
) => {
	try {
		const fields = parseSelectedFieldsFromRequest(req);
		const { limit, page } = parsePaginationInfosFromRequest(req);
		const filter = parseFilterFromRequest(req);

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

export const getNoteById = async (
	req: TypedRequest<never, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.params;
		const note = await Note.findById(id);
		if (!note) throw new APIError(404);
		res.json(note);
	} catch (error) {
		APIError.handleError(res, error);
	}
};

async function handleTags(
	tags: (string | mongoose.Types.ObjectId)[],
): Promise<mongoose.Types.ObjectId[]> {
	const tagIds: mongoose.Types.ObjectId[] = [];
	for (const tag of tags) {
		if (typeof tag === "string") {
			try {
				if (mongoose.isValidObjectId(tag)) {
					const existingTag = await Tag.findById(tag);
					if (existingTag) {
						tagIds.push(existingTag._id);
					}
				} else {
					const existingTag = new Tag({ title: tag } as ITagWrite);
					await existingTag.save();
					tagIds.push(existingTag._id);
				}
			} catch (_e) {}
		} else if (tag instanceof mongoose.Types.ObjectId) {
			tagIds.push(tag);
		}
	}

	return tagIds;
}

export const createNote = async (
	req: TypedRequest<INoteWrite>,
	res: Response,
) => {
	try {
		req.body.cover = saveBase64Image(req.body.cover);

		if (req.body.tags) {
			req.body.tags = await handleTags(req.body.tags);
		}

		const note = new Note(req.body);
		await note.save();
		res.status(201).json(note);
	} catch (error) {
		APIError.handleError(res, error);
	}
};

export const updateNote = async (
	req: TypedRequest<INoteWrite, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.params;
		req.body.cover = saveBase64Image(req.body.cover);

		if (req.body.tags) {
			req.body.tags = await handleTags(req.body.tags);
		}

		const note = await Note.findByIdAndUpdate(id, req.body, { new: true });

		if (!note) {
			throw new APIError(404);
		}

		res.json(note);
	} catch (error) {
		APIError.handleError(res, error);
	}
};

export const deleteNote = async (
	req: TypedRequest<never, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.params;
		const note = await Note.findByIdAndDelete(id);
		if (note?.cover) {
			fs.unlinkSync(path.join(__dirname, `../../../uploads/${note.cover}`));
		}
		res.json({ message: "Note deleted" });
	} catch (error) {
		APIError.handleError(res, error);
	}
};
