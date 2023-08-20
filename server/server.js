const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// to parse incoming requests with JSON payloads
app.use(express.json());

app.listen(port, () => console.log(`Listening on port ${port}`));

// Store and retrieve your videos from here
// If you want, you can copy "exampleresponse.json" into here to have some data to work with
const videos = require("./exampleresponse.json");

// GET "/"
// Returns all the videos
app.get("/", (request, response) => {
  response.json(videos);
});

// Returns video with specific id
app.get("/videos/:id", (request, response) => {
  let id = Number(request.params.id);
  response.json(videos.filter((video) => video.id === id));
});

// POST
// This endpoint is used to add a video to the API.
// Both fields - title and url - must be included and be valid for this to succeed.
// **Note:** When a video is added, you must attach a unique ID to so that it can later be deleted
app.post("/", (request, response) => {
  const { id, title, url, rating } = request.body;

  if (!title || !url) {
    return response.status(400).json({
      result: "failure",
      message: "Video could not be saved",
    });
  } else if (url.indexOf("youtube.com/watch?v=") === -1) {
    return response.status(400).json({
      result: "failure",
      message: "Video could not be saved",
    });
  } else {
    const calculateNewID = () => {
      let newID = Math.max(...videos.map((video) => video.id)) + 1;
      return newID;
    };

    const newVideo = {
      id: calculateNewID(),
      title: title,
      url: url,
      rating: 0,
    };
    videos.push(newVideo);
    response.status(201).json({
      id: newVideo.id,
      message: "Video was saved",
    });
  }
});
