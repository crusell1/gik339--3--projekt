const PORT = process.env.PORT || 3000;

const movies = [];

function nextId() {
  const n = movies.length + 1;
  return String(n).padStart(3, "0");
}

const express = require("express"); //imorterar express
const server = express(); //startar servern

server.use(express.json());
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

server.get("/movies", (req, res) => {
  res.status(200).json(movies); //returnerar listan
});

server.post("/movies", (req, res) => {
  const { title, rating, reviewText } = req.body;
  const id = nextId();
  const newMovie = {
    id: id,
    title: title,
    rating: rating,
    reviewText: reviewText,
  };

  movies.push(newMovie); // sparar i arrayen
  res.status(201).json(newMovie);
});

server.get("/movies/:id", (req, res) => {
  const id = req.params.id;
  const movie = movies.find((t) => t.id === id);

  if (!movie) {
    return res.sendStatus(404);
  }

  res.status(200).json(movie);
});

server.put("/movies/:id", (req, res) => {
  const id = req.params.id;
  const { title, rating, reviewText } = req.body;

  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return res.sendStatus(404);
  }

  movie.title = title ?? movie.title;
  movie.rating = rating ?? movie.rating;
  movie.reviewText = reviewText ?? movie.reviewText;

  res.json(movie);
});

server.delete("/movies/:id", (req, res) => {
  const id = req.params.id;

  const index = movies.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.sendStatus(404);
  }

  movies.splice(index, 1);
  res.status(204).json(movies);
});
