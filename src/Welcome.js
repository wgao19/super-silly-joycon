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
    [onNext]
  );
  useEffect(
    () =>
      subscribe("y", payload => {
        if (payload === "pressed") {
          onNext();
        }
      }),
    [onNext]
  );
  useEffect(() => {
    document.body.style =
      "height: 100vh; background-image: linear-gradient(black, black), url(https://image.businessinsider.com/544a96b0eab8ea8945608ad2?width=600&format=jpeg&auto=webp); background-size: cover; background-blend-mode: saturation;";
    return () => (document.body.style = undefined);
  });
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
