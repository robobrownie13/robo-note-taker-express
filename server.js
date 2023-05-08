const PORT = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();

const notesData = require("./db/db.json");
const id = uuidv4();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(notesData.slice(1));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

function createNote(id, body, notesArray) {
  const newNote = { id, body };
  notesArray.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notesArray, null, 2)
  );
  return newNote;
}

app.post("/api/notes", (req, res) => {
  const newNote = createNote(req.id, notesData);
  res.json(newNote);
});

function deleteNote(id, notesArray) {
  for (let i = 0; i < notesArray.length; i++) {
    if (notesArray[i].id === id) {
      //splice
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesArray, null, 2)
      );
    }
  }
}

app.delete("/api/notes/:id", (req, res) => {
  deleteNote(notesData, req.params.id);
  res.json();
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});

// const newNote = body;
// if (notesArray.length === 0) notesArray.push(0);
// body.id = notesArray[0];
// notesArray[0]++;
