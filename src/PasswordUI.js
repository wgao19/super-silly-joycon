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
    test: password => password.split("").includes("🙌")
  }
];

const PasswordUI = () => {
  const [value, setValue] = useState("");
  const processed = requirements.map(r => {
    return { ...r, result: r.test(value) };
  });
  return (
    <form>
      <input
        className="password-input"
        onChange={event => setValue(event.currentTarget.value)}
        type="text"
        value={value}
      />
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
