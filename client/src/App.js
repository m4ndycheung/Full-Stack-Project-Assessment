import "./App.css";
import React, { useState } from "react";
import videoData from "./exampleresponse.json";
import VideoList from "./VideoList";

function App() {
  const [videos, setVideos] = useState(videoData);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video Recommendation</h1>
      </header>
      <VideoList videos={videos} />
    </div>
  );
}

export default App;
