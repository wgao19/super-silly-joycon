import * as React from "react";

import { subscribe } from "./eventBus";
import { getCurrentPositions } from "./posenet";
import {
  matchPosition,
  // poseToChar,
  cuddling,
  facepalm,
  lotusPosition,
  raisedRightHand,
  shrugging,
  standingStill
} from "./utils";

const gestures = [
  {
    type: "emoji",
    label: "🙋🏻‍♀️",
    caption: "Raise your right hand",
    predicate: raisedRightHand
  },
  {
    type: "emoji",
    label: "🤷🏻‍♀️",
    caption: "Show your attitude ¯\\_(ツ)_/¯",
    predicate: shrugging
  },
  {
    type: "emoji",
    label: "🤦‍♀️",
    caption: "Face + palm = BFFs",
    predicate: facepalm
  },
  {
    type: "emoji",
    label: "🧘🏾‍♂️",
    caption: "Meditate on the meaning of life",
    predicate: lotusPosition
  },
  {
    type: "gif",
    url: "https://i.imgur.com/HELVWiM.gif",
    caption: "Cuddle on the floor",
    predicate: cuddling
  },
  {
    type: "gif",
    url: "https://i.imgur.com/6hcqc5a.gif",
    caption: "Try hard to stand still",
    predicate: standingStill
  }
];

const GestureUI = ({ onNext }) => {
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
            if (step + 1 < gestures.length) {
              setStep(cur => (cur + 1) % gestures.length);
            } else {
              onNext(); // completed this gesture part
            }
          } else {
            setResponse("🙅");
          }
        }
      }),
    [predicate, setResponse, onNext, step]
  );

  return (
    <div>
      {type === "emoji" ? (
        <span style={{ fontSize: "64px" }}>{label}</span>
      ) : (
        <img alt="hex" src={url} />
      )}
      <h2>{caption}</h2>
      <h2>{response}</h2>
    </div>
  );
};

export default GestureUI;
