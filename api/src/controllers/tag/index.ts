import Tag from "@m/Tag";
import type { Request, Response } from "express";

export const getTags = async (_req: Request, res: Response) => {
	try {
		const tags = await Tag.find();
		res.json({ results: tags });
	} catch (error) {
		res.status(404).json({ message: "Tags not found" });
	}
};

export const getTagById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const tag = await Tag.findById(id);
		res.json(tag);
	} catch (error) {
		res.status(404).json({ message: "Tag not found" });
	}
};

export const createTag = async (req: Request, res: Response) => {
	try {
		const tag = new Tag(req.body);
		await tag.save();
		res.status(201).json(tag);
	} catch (error) {
		res.status(400).json({ message: "Invalid tag" });
	}
};

export const updateTag = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const tag = await Tag.findByIdAndUpdate(id, req.body, { new: true });
		res.json(tag);
	} catch (error) {
		res.status(404).json({ message: "Tag not found" });
	}
};

export const deleteTag = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		await Tag.findByIdAndDelete(id);
		res.json({ message: "Tag deleted" });
	} catch (error) {
		res.status(404).json({ message: "Tag not found" });
	}
};
