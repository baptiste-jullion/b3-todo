import cors from "cors";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import type { Note } from "../shared/types/Note";

const app = express();
app.use(express.json());
const port = 8080;

const notes: Note[] = [];

app.use(cors());

app.get("/notes", (_req, res) => {
	res.status(200).send(notes);
});

app.post("/notes", (req, res) => {
	const note: Omit<Note, "id"> = req.body;
	notes.push({
		...note,
		id: uuidv4(),
	});
	res.status(201).send(note);
});

app.delete("/notes/:id", (req, res) => {
	const { id } = req.params;
	const index = notes.findIndex((note) => note.id === id);
	if (index === -1) {
		res.status(404).send();
		return;
	}
	notes.splice(index, 1);
	res.status(204).send();
});

app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
