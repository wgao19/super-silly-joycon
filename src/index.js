// work in progress notes https://aworkinprogress.dev/joy-con-clicker/

import React from "react";
import ReactDOM from "react-dom";
import { gamepadConnect, gamepadDisconnect } from "./gamepad";
// import NintendoUI from "./NintendoUI";
import PasswordUI from "./PasswordUI";
import GestureUI from "./GestureUI";
import Pose from "./Pose";
import Welcome from "./Welcome";
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

  const [stage, setStage] = React.useState(0);

  const onStage0Done = () => {
    setStage(1);
  };

  return (
    <div>
      {/*<div className="display" id="button-x-display" />*/}
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
