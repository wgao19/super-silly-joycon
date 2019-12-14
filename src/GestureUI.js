import * as React from "react";

const gestures = [
  {
    type: "emoji",
    label: "🙋🏻‍♀️",
    caption: "Raise your right hand"
  },
  {
    type: "emoji",
    label: "🤷🏻‍♀️",
    caption: "Shrug???"
  },
  {
    type: "gif",
    url: "https://i.imgur.com/HELVWiM.gif",
    caption: "Cuddle on the floor"
  }
];

const GestureUI = () => {
  const [step, setStep] = React.useState(0);
  const { type, label, caption, url } = gestures[step];

  return (
    <div
      onClick={() => {
        setStep(cur => (cur + 1) % gestures.length);
      }}
    >
      {type === "emoji" ? (
        <span style={{ fontSize: "64px" }}>{label}</span>
      ) : (
        <img src={url} />
      )}
      <h2>{caption}</h2>
    </div>
  );
};

export default GestureUI;
