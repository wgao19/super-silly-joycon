// work in progress notes https://aworkinprogress.dev/joy-con-clicker/

import React from "react";
import ReactDOM from "react-dom";
import { gamepadConnect, gamepadDisconnect } from "./gamepad";
// import NintendoUI from "./NintendoUI";

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
  return (
    <div>
      {/* <NintendoUI /> */}
      <div className="display" id="gamepad-display" />
      <div className="display" id="button-x-display" />
    </div>
  );
};

function App() {
  return <JoyConController />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
