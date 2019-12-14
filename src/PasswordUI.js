import React, { useState } from "react";

const requirements = [
  {
    name: "This is required",
    test: password => {
      if (password.length === 0) {
        return false;
      }

      return true;
    }
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
      {processed.map(p => (
        <p>
          {p.result ? "✅" : "❌"}
          {p.name}
        </p>
      ))}
    </form>
  );
};

export default PasswordUI;
