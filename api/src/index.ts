import cors from "cors";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import type { Note } from "./types/Note";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const notes: Note[] = [];

console.log("hey !");

app.get("/notes", (_req, res) => {
	console.log("Received GET request for /notes");
	res.status(200).send(notes);
});

app.post("/notes", (req, res) => {
	const note: Omit<Note, "id"> = req.body;
	console.log("Received POST request for /notes with data:", note);

	const newNote = {
		...note,
		id: uuidv4(),
	};
	notes.push(newNote);

	console.log("Note created with ID:", newNote.id);
	res.status(201).send(newNote);
});

app.delete("/notes/:id", (req, res) => {
	const { id } = req.params;
	console.log(`Received DELETE request for /notes/${id}`);

	const index = notes.findIndex((note) => note.id === id);
	if (index === -1) {
		console.error(`Note with ID ${id} not found.`);
		return res.status(404).send({ error: `Note with ID ${id} not found.` });
	}

	notes.splice(index, 1);
	console.log(`Note with ID ${id} deleted successfully.`);
	res.status(204).send();
});

app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`);
});
