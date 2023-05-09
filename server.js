const PORT = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();

const id = uuidv4();

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
      id,
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

// function deleteNote(id) {
//   for (let i = 0; i < notesArray.length; i++) {
//     if (notesArray[i].id === id) {
//       notesArray.splice(i, 1);
//       fs.writeFileSync(
//         path.join(__dirname, "./db/db.json"),
//         JSON.stringify(notesArray, null, 2)
//       );
//     }
//   }
// }

// app.delete("/api/notes/:id", (req, res) => {
//   deleteNote(notesData, req.params.id);
//   res.json();
// });

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});
