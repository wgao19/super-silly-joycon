import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { gamepadConnect, gamepadDisconnect } from "./gamepad";
import PasswordUI from "./PasswordUI";
import GestureUI from "./GestureUI";
import EndUI from "./EndUI";
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

  const onStageDone = () => setStage(stage + 1);

  const startTime = useRef(Date.now());
  const [time, setTime] = useState(["00", "00"]);

  const winLiao = stage === 2;
  useEffect(() => {
    setInterval(() => {
      const diff = Date.now() - startTime.current;
      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds - minutes * 60;
      if (winLiao) {
        // stop updating when win liao
        setTime([
          minutes > 9 ? `${minutes}` : `0${minutes}`,
          seconds > 9 ? `${seconds}` : `0${seconds}`
        ]);
      }
    }, 1000);
  }, []);

  return (
    <div>
      <h2 style={{ color: winLiao && "lightgreen" }}>
        Time {`${time[0]}:${time[1]}`}
      </h2>
      {stage === 0 && <Welcome onNext={onStageDone} />}
      {stage === 1 && <GestureUI onNext={onStageDone} />}
      {winLiao && <EndUI time={time} />}
      <Pose />
    </div>
  );
};

function App() {
  return <JoyConController />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
