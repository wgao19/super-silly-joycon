import React, { useEffect, useState } from "react";

import { subscribe } from "./eventBus";
import { getCurrentPositions } from "./posenet";
import { poseToChar } from "./utils";

const requirements = [
  {
    name: "This is required",
    test: password => password.length > 0
  },
  {
    name: "Put up both your hands",
    test: password => [...password].includes("🙌")
  }
];

const PasswordUI = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [value, setValue] = useState("");

  useEffect(
    () =>
      subscribe("a", payload => {
        if (payload === "pressed") {
          const pose = getCurrentPositions();
          const char = poseToChar(pose);
          setValue(`${value}${char}`);
        }
      }),
    [value]
  );
  useEffect(
    () =>
      subscribe("y", payload => {
        if (payload === "pressed") {
          const pose = getCurrentPositions();
          const char = poseToChar(pose);
          setValue(`${value}${char}`);
        }
      }),
    [value]
  );

  const processed = requirements.map(r => {
    return { ...r, result: r.test(value) };
  });
  return (
    <div className="password-container">
      <form>
        <div className="input-wrapper">
          <input
            className="input"
            onChange={event => setValue(event.currentTarget.value)}
            type={showPassword ? "text" : "password"}
            value={value}
          />
          <button
            className="show-password"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            type="button"
          >
            {showPassword ? "🙈" : "👀"}
          </button>
        </div>
        <button
          className="hit-me"
          disabled={processed.filter(r => r.result === false).length > 0}
        >
          Hit me up
        </button>
      </form>
      <div className="am-i-wrong">
        {processed.map((p, index) => (
          <p key={index}>
            <span className="requirement-icon">{p.result ? "✅" : "❌"}</span>
            {p.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PasswordUI;
