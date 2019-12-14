// work in progress notes https://aworkinprogress.dev/joy-con-clicker/

import React from "react";
import ReactDOM from "react-dom";
import { gamepadConnect, gamepadDisconnect } from "./gamepad";
// import NintendoUI from "./NintendoUI";
import PasswordUI from "./PasswordUI";
import { videoHeight, videoWidth, getCurrentPositions } from "./posenet";
import "./styles.css";

const JoyConController = () => {
  React.useEffect(() => {
    window.addEventListener("gamepadconnected", gamepadConnect);
    window.addEventListener("gamepaddisconnected", gamepadDisconnect);
    return () => {
      window.removeEventListener("gamepadconnected", gamepadConnect);
      window.removeEventListener("gamepaddisconnected", gamepadDisconnect);
    };
  }, []);
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
    <div>
      <div className="display" id="gamepad-display" />
      <div className="display" id="button-x-display" />
      <PasswordUI />
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
      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <pre style={{ fontSize: "small", textAlign: "left" }}>
        {JSON.stringify(filteredPos, null, 2)}
      </pre>
    </div>
  );
};

function App() {
  return <JoyConController />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
