const PORT = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(JSON.parse(fs.readFileSync("./db/db.json", "utf8")));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(parsedData), (err) => {
          if (err) console.error(err);
        });
      }
    });
    res.json(newNote);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const dataJSON = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
  const newNotes = dataJSON.filter((note) => {
    return note.id !== req.params.id;
  });
  fs.writeFileSync("db/db.json", JSON.stringify(newNotes));
  res.json("Note deleted.");
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});
