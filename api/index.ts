import cors from "cors";
import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = 8080;

interface Task {
	id: string; // UUID
	title: string;
	description: string;
}

const tasks: Task[] = [
	{
		id: "a4d45f26-ca80-5f4a-93be-b1141980f5b3",
		title: "Task 1",
		description: "This is the first task",
	},
	{
		id: "7b6f7e29-626c-540c-9aa9-599cb4effb69",
		title: "Task 2",
		description: "This is the second task",
	},
];

app.use(cors());

app.get("/tasks", (_req, res) => {
	res.status(200).send(tasks);
});

app.post("/tasks", (req, res) => {
	const task: Omit<Task, "id"> = req.body;
	tasks.push({
		...task,
		id: uuidv4(),
	});
	res.status(201).send(task);
});

app.delete("/tasks/:id", (req, res) => {
	const { id } = req.params;
	const index = tasks.findIndex((task) => task.id === id);
	if (index === -1) {
		res.status(404).send("Task not found");
		return;
	}
	tasks.splice(index, 1);
	res.status(204).send();
});

app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
