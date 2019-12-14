import * as React from "react";

import { subscribe } from "./eventBus";
import { getCurrentPositions } from "./posenet";
import { matchPosition, poseToChar, cuddling } from "./utils";

const gestures = [
  {
    type: "emoji",
    label: "🙋🏻‍♀️",
    caption: "Raise your right hand",
    predicate: cuddling
  },
  {
    type: "emoji",
    label: "🤷🏻‍♀️",
    caption: "Shrug???",
    predicate: cuddling
  },
  {
    type: "gif",
    url: "https://i.imgur.com/HELVWiM.gif",
    caption: "Cuddle on the floor",
    predicate: cuddling
  }
];

const GestureUI = () => {
  const [step, setStep] = React.useState(0);
  const [response, setResponse] = React.useState("");

  const { type, label, caption, url, predicate } = gestures[step];
  React.useEffect(
    () =>
      subscribe("a", payload => {
        if (payload === "pressed") {
          const pose = getCurrentPositions();
          if (matchPosition(pose, predicate)) {
            setResponse("🙆");
            setStep(cur => (cur + 1) % gestures.length);
          } else {
            setResponse("🙅");
          }
        }
      }),
    [predicate, setResponse]
  );

  return (
    <div>
      {type === "emoji" ? (
        <span style={{ fontSize: "64px" }}>{label}</span>
      ) : (
        <img src={url} />
      )}
      <h2>{caption}</h2>
      <h2>{response}</h2>
    </div>
  );
};

export default GestureUI;
