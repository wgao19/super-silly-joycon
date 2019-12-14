import React from "react";

import { videoHeight, videoWidth, getCurrentPositions } from "./posenet";

const Pose = () => {
  const [pos, setPos] = React.useState({});
  React.useEffect(() => {
    const id = setInterval(() => {
      setPos(getCurrentPositions());
    }, 1000);
    return () => clearInterval(id);
  });
  return (
    <>
      <div style={{ position: "relative" }}>
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
        {JSON.stringify(pos, null, 2)}
      </pre>
    </>
  );
};

export default Pose;
