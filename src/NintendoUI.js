import * as React from "react";

const NintendoUI = () => (
  <div className="nintendo">
    <div className="container">
      <div className="heart-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="heart"
          id="heart"
        >
          <path d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z" />
        </svg>
      </div>
    </div>
    <div className="nintendo-right" id="right">
      <div className="minor-buttons" />
      <div className="major-button" id="rstick" />
      <div className="extra-button" />
      <div className="plus-button" id="plus">
        <div className="minus-button" />
        <div className="minus-button" />
      </div>
    </div>
    <div className="nintendo-left" id="left">
      <div className="minor-buttons" />
      <div className="major-button" id="lstick" />
      <div className="extra-button" id="screenshot" />
      <div className="minus-button" id="minus" />
    </div>
    <div className="intersection-right">
      <div className="intersection-left" />
    </div>
  </div>
);

export default NintendoUI;
