const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// cors
let cors = require("cors");
app.use(cors());

// to parse incoming requests with JSON payloads
app.use(express.json());

// body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.listen(port, () => console.log(`Listening on port ${port}`));

// set up a connection to the database
const { Pool } = require("pg");
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: true,
});

// GET "/"
// Returns all the videos
app.get("/", function (request, response) {
  db.query("SELECT * FROM videos")
    .then((result) => {
      response.json(result.rows);
    })
    .catch((error) => {
      console.log(error);
    });
});

// Returns video with specific id
app.get("/videos/:id", (request, response) => {
  let id = Number(request.params.id);
  db.query("SELECT * FROM videos WHERE id = $1", [id])
    .then((result) => {
      response.json(result.rows);
    })
    .catch((error) => {
      console.log(error);
    });
});

// POST
// This endpoint is used to add a video to the API.
// Both fields - title and url - must be included and be valid for this to succeed.
app.post("/", (request, response) => {
  const newTitle = request.body.title;
  const newURL = request.body.url;

  // RETURNING clause returns generated id and rating after INSERT
  const query = `INSERT INTO videos (title, url)
    VALUES ($1, $2) RETURNING *`;

  db.query(query, [newTitle, newURL])
    .then((result) => {
      console.log(result.rows);
      const newID = result.rows.id;
      const newRating = result.rows.rating;

      response.status(201).json({
        id: newID,
        title: newTitle,
        url: newURL,
        rating: newRating,
        message: "Video was saved",
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // if (!title || !url) {
  //   return response.status(400).json({
  //     result: "failure",
  //     message: "Video could not be saved, add a title or url",
  //   });
  // }
});

// DELETE
// Deletes the video with the ID container within the `{id}` parameter
app.delete("/videos/:id", (request, response) => {
  const id = Number(request.params.id);

  const videoToDelete = videos.find((video) => video.id === id);

  if (videoToDelete === undefined) {
    response.status(401).json({
      result: "failure",
      message: "Video could not be found",
    });
  } else {
    // get the index of the video object that we want to delete
    const index = videos.indexOf(videoToDelete);

    // use splice to delete -- video array will be mutated
    videos.splice(index, 1);

    response.status(201).json({
      message: "Video was deleted",
    });
  }
});
