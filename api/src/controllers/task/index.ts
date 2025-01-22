import Task from "@m/Task";
import type { AuthenticatedRequest } from "@u";
import type { Request, Response } from "express";

export const getTasks = async (_req: Request, res: Response) => {
	try {
		const tasks = await Task.find();
		res.json(tasks);
	} catch (error) {
		res.status(404).json({ message: "Tasks not found" });
	}
};

export const getTaskById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const task = await Task.findById(id);
		res.json(task);
	} catch (error) {
		res.status(404).json({ message: "Task not found" });
	}
};

export const createTask = async (req: Request, res: Response) => {
	try {
		const task = new Task(req.body);
		await task.save();
		res.status(201).json(task);
	} catch (error) {
		res.status(400).json({ message: "Invalid task" });
	}
};

export const updateTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
		res.json(task);
	} catch (error) {
		res.status(404).json({ message: "Task not found" });
	}
};

export const deleteTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		await Task.findByIdAndDelete(id);
		res.json({ message: "Task deleted" });
	} catch (error) {
		res.status(404).json({ message: "Task not found" });
	}
};

export const completeTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const task = await Task.findByIdAndUpdate(
			id,
			{ completed: true, completedBy: (req as AuthenticatedRequest).userId },
			{ new: true },
		);
		res.json(task);
	} catch (error) {
		res.status(404).json({ message: "Task not found" });
	}
}

export const uncompleteTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const task = await Task.findByIdAndUpdate(
			id,
			{ completed: false, completedBy: null },
			{ new: true },
		);
		res.json(task);
	} catch (error) {
		res.status(404).json({ message: "Task not found" });
	}
}