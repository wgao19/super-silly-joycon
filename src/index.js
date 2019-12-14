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

  const startTime = useRef(null);
  const [time, setTime] = useState(["00", "00"]);

  let startLiao = stage > 0;
  let winLiao = stage === 2;
  useEffect(() => {
    const id = setInterval(() => {
      if (!startLiao) return;
      if (!startTime.current) startTime.current = Date.now();
      const diff = Date.now() - startTime.current;
      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds - minutes * 60;
      if (startLiao && !winLiao) {
        // only update time when havent win yet
        const newtime = [
          minutes > 9 ? `${minutes}` : `0${minutes}`,
          seconds > 9 ? `${seconds}` : `0${seconds}`
        ];
        console.log({ newtime });
        setTime(newtime);
      } else {
        setTime(time);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [startLiao, winLiao]);

  return (
    <div>
      <h2 style={{ color: winLiao && "lightgreen" }}>
        Time {`${time[0]}:${time[1]}`}
      </h2>
      {!startLiao && <Welcome onNext={onStageDone} />}
      {startLiao && !winLiao && <GestureUI onNext={onStageDone} />}
      {winLiao && <EndUI time={time} />}
      {!winLiao && <Pose />}
    </div>
  );
};

function App() {
  return <JoyConController />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
