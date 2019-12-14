import React, { useEffect, useState, useRef } from "react";

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
  const startTime = useRef(Date.now());
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState("");
  const [time, setTime] = useState(["00", "00"]);

  useEffect(() => {
    setInterval(() => {
      const diff = Date.now() - startTime.current;
      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds - minutes * 60;
      setTime([
        minutes > 9 ? `${minutes}` : `0${minutes}`,
        seconds > 9 ? `${seconds}` : `0${seconds}`
      ]);
    }, 1000);
  }, []);

  useEffect(() => {
    subscribe("a", payload => {
      if (payload === "pressed") {
        const pose = getCurrentPositions();
        const char = poseToChar(pose);
        setValue(`${value}${char}`);
      }
    });
    subscribe("y", payload => {
      console.log(payload);
      if (payload === "pressed") {
        const pose = getCurrentPositions();
        const char = poseToChar(pose);
        setValue(`${value}${char}`);
      }
    });
  }, []);

  const processed = requirements.map(r => {
    return { ...r, result: r.test(value) };
  });
  return (
    <div className="password-wrapper">
      <h1>Time {`${time[0]}:${time[1]}`}</h1>
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
    </div>
  );
};

export default PasswordUI;
