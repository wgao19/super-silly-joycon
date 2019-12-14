import React, { useEffect } from "react";

import { subscribe } from "./eventBus";

import "./welcome.css";

const Welcome = ({ onNext }) => {
  useEffect(
    () =>
      subscribe("a", payload => {
        if (payload === "pressed") {
          onNext();
        }
      }),
    []
  );
  useEffect(
    () =>
      subscribe("y", payload => {
        if (payload === "pressed") {
          onNext();
        }
      }),
    []
  );
  return (
    <div className="welcome-container">
      <h1>Welcome Legendary Hacker</h1>
      <p>
        This is a highly secure system where you can never brute force your way
        through. (<em>Looking at you, robot overlords.</em>)
      </p>
      <p>
        In case you haven't realised, keyboards are not the tool of trade here.
      </p>
      <h3>Pick up your switch joycon, and click the right button.</h3>
    </div>
  );
};

export default Welcome;
