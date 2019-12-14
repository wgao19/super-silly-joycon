import React, { useState } from "react";

const requirements = [
  {
    name: "This is required",
    test: password => password.length > 0
  },
  {
    name: "Must have a number",
    test: password =>
      password.split("").some(x => "0123456789".split("").includes(x))
  },
  {
    name: "Put up both your hands",
    test: password => [...password].includes("🙌")
  }
];

const PasswordUI = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState("");
  const processed = requirements.map(r => {
    return { ...r, result: r.test(value) };
  });
  return (
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
      {processed.map((p, index) => (
        <p key={index}>
          {p.result ? "✅" : "❌"}
          {p.name}
        </p>
      ))}
    </form>
  );
};

export default PasswordUI;
