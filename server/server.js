const PORT = process.env.PORT || 3000;

const express = require("express"); //imorterar express
const server = express(); //startar servern

server.use(express.json());
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

const cors = require("cors");
server.use(cors());

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(__dirname, "movies.db");

db.run(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    rating INTEGER NOT NULL,
    reviewText TEXT NOT NULL
  )
`);

db.get("SELECT COUNT(*) AS count FROM movies", [], (error, row) => {
  if (error) {
    console.log("Fel vid kontroll av databasen:", error.message);
    return;
  }

  // Om tabellen är tom – lägg in startfilmer
  if (row.count === 0) {
    const startMovies = [
      [
        "The Dark Knight",
        10,
        "En av de bästa filmerna någonsin. Joker är ikonisk.",
      ],
      ["Interstellar", 9, "Stark sci-fi om tid, rymd och relationer."],
      ["Spirited Away", 8, "Magisk, kreativ och visuellt fantastisk."],
    ];

    const sql =
      "INSERT INTO movies (title, rating, reviewText) VALUES (?, ?, ?)";
  }
});

server.get("/movies", (req, res) => {
  db.all("SELECT * FROM movies", [], (error, rows) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Serverfel vid hämtning av filmer" });
    }

    res.status(200).json(rows); //returnerar listan
  });
});

server.post("/movies", (req, res) => {
  const { title, rating, reviewText } = req.body;

  db.run(
    "INSERT INTO movies (title, rating, reviewText) VALUES (?, ?, ?)",
    [title, rating, reviewText],
    function (error) {
      if (error) {
        return res
          .status(500)
          .json({ message: "Serverfel vid skapande av film" });
      }

      res.status(201).json({
        id: this.lastID,
        title,
        rating,
        reviewText,
      });
    }
  );
});

server.get("/movies/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM movies WHERE id = ?", [id], (error, row) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Serverfel vid hämtning av film" });
    }

    if (!row) {
      return res.sendStatus(404);
    }

    res.status(200).json(row);
  });
});

server.put("/movies/:id", (req, res) => {
  const id = req.params.id;
  const { title, rating, reviewText } = req.body;

  db.run(
    "UPDATE movies SET title = ?, rating = ?, reviewText = ? WHERE id = ?",
    [title, rating, reviewText, id],
    function (error) {
      if (error) {
        return res
          .status(500)
          .json({ message: "Serverfel vid uppdatering av film" });
      }

      // Om inget uppdaterades => id fanns inte
      if (this.changes === 0) {
        return res.sendStatus(404);
      }

      // Hämta uppdaterad rad och skicka tillbaka
      db.get("SELECT * FROM movies WHERE id = ?", [id], (error2, row) => {
        if (error2) {
          return res
            .status(500)
            .json({ message: "Serverfel vid hämtning av uppdaterad film" });
        }
        res.status(200).json(row);
      });
    }
  );
});

server.delete("/movies/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM movies WHERE id = ?", [id], function (error) {
    if (error) {
      return res
        .status(500)
        .json({ message: "Serverfel vid borttagning av film" });
    }

    // Om inget togs bort => id fanns inte
    if (this.changes === 0) {
      return res.sendStatus(404);
    }

    // 204 = lyckad borttagning, inget innehåll tillbaka
    res.sendStatus(204);
  });
});
