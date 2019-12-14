// work in progress notes https://aworkinprogress.dev/joy-con-clicker/

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { gamepadConnect, gamepadDisconnect } from "./gamepad";
// import NintendoUI from "./NintendoUI";
import PasswordUI from "./PasswordUI";
import GestureUI from "./GestureUI";
import Pose from "./Pose";
import Welcome from "./Welcome";
import "./styles.css";

const JoyConController = () => {
  useEffect(() => {
    window.addEventListener("gamepadconnected", gamepadConnect);
    window.addEventListener("gamepaddisconnected", gamepadDisconnect);
    return () => {
      window.removeEventListener("gamepadconnected", gamepadConnect);
      window.removeEventListener("gamepaddisconnected", gamepadDisconnect);
    };
  }, []);

  const [stage, setStage] = useState(0);

  const onStage0Done = () => {
    setStage(1);
  };

  const startTime = useRef(Date.now());
  const [time, setTime] = useState(["00", "00"]);

  useEffect(() => {
    setInterval(() => {
      const diff = Date.now() - startTime.current;
      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds - minutes * 60;
      setTime([
        minutes > 9 ? `${minutes}` : `0${minutes}`,
        seconds > 9 ? `${seconds}` : `0${seconds}`
      ]);
    }, 1000);
  }, []);

  return (
    <div>
      {/*<div className="display" id="button-x-display" />*/}
      <h2>Time {`${time[0]}:${time[1]}`}</h2>
      {stage === 0 && <Welcome onNext={onStage0Done} />}
      {stage === 1 && <PasswordUI />}
      {stage === 2 && <GestureUI />}
      {stage > 0 && <Pose />}
      <div className="display" id="gamepad-display" />
    </div>
  );
};

function App() {
  return <JoyConController />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
