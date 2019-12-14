import React from "react";

import { videoHeight, videoWidth, getCurrentPositions } from "./posenet";

const Pose = () => {
  let [pos, setPos] = React.useState([]);
  const [filter, setFilter] = React.useState(
    "rightEye rightWrist leftEye leftWrist"
  );
  let filteredPos = [];
  pos.forEach(_pos => {
    let newFilteredPos = {};
    if (filter && filter.split) {
      filter.split(" ").forEach(field => (newFilteredPos[field] = _pos[field]));
    } else {
      newFilteredPos = pos;
    }
    filteredPos.push(newFilteredPos);
  });
  React.useEffect(() => {
    const id = setInterval(() => {
      setPos(getCurrentPositions());
    }, 1000);
    return () => clearInterval(id);
  });
  return (
    <>
      <div style={{ position: "relative" }}>
        <h1 id="loadingVideo">Loading video...</h1>
        <video
          id="video"
          playsInline
          style={{
            transform: "scaleX(-1)"
          }}
        ></video>
        <canvas
          id="output"
          style={{
            position: "absolute",
            left: `calc(50% - ${videoWidth}px / 2)`,
            top: `calc(50% - ${videoHeight}px / 2)`,
            zIndex: 1
          }}
        ></canvas>
      </div>
      <pre style={{ fontSize: "small", textAlign: "left" }}>
        {JSON.stringify(filteredPos, null, 2)}
      </pre>
    </>
  );
};

export default Pose;
