import { dispatch } from "./eventBus";

// type of connected game pads:
// { gamepad: Gamepad, buttonMap: [] }
let start,
  connectedGamepads = [];

const progress = ["not pressed", "pressed", "hold", "released"];

const buttonLabels = [
  "a",
  "x",
  "b",
  "y",
  "sl",
  "sr",
  "-",
  "-",
  "minus",
  "plus",
  "lstick",
  "rstick",
  "home",
  "screenshot",
  "bumper",
  "trigger"
];

const THRESHOLD = 400;

const update = (gamepad, buttonObservers) => {
  buttonObservers.map(buttonObserver => {
    const pressed = gamepad.buttons[buttonObserver.index].pressed;
    if (pressed) {
      switch (buttonObserver.state) {
        case "not pressed":
        case "released": {
          // change from not pressed to pressed and update timestamp
          buttonObserver.state = "pressed";
          buttonObserver.recentlyUpdated = +new Date();
          dispatch("simple-button-gesture", {
            label: buttonObserver.label,
            state: buttonObserver.state
          });
          break;
        }
        case "pressed": {
          // already pressed, do not change unless it's passed threashold
          if (+new Date() - buttonObserver.recentlyUpdated > THRESHOLD) {
            buttonObserver.state = "hold";
            dispatch("simple-button-gesture", {
              label: buttonObserver.label,
              state: buttonObserver.state
            });
          }
          break;
        }
        case "hold": // hold + pressed, still hold, do nothing
        default: {
          // do nothing
        }
      }
    } else {
      // new case is not pressed
      switch (buttonObserver.state) {
        case "pressed": {
          buttonObserver.state = "not pressed";
          buttonObserver.recentlyUpdated = +new Date();
          dispatch("simple-button-gesture", {
            label: buttonObserver.label,
            state: buttonObserver.state
          });
          break;
        }
        case "hold": {
          buttonObserver.state = "released";
          buttonObserver.recentlyUpdated = +new Date();
          dispatch("simple-button-gesture", {
            label: buttonObserver.label,
            state: buttonObserver.state
          });
          break;
        }
        case "released": {
          if (+new Date() - buttonObserver.recentlyUpdated > THRESHOLD) {
            buttonObserver.state = "not pressed";
            dispatch("simple-button-gesture", {
              label: buttonObserver.label,
              state: buttonObserver.state
            });
          }
          break;
        }
        case "not pressed":
        default: {
          // do nothing
        }
      }
    }
  });
};

const gameLoop = () => {
  if (connectedGamepads.length > 0) {
    connectedGamepads.forEach(({ gamepad, buttonMap }) => {
      update(gamepad, buttonMap);
    });
  }
  requestAnimationFrame(gameLoop);
};

const renderConnectedGamepadInfo = () => {
  document.getElementById("gamepad-display").innerHTML = connectedGamepads
    .map(
      ({ gamepad: gp }) =>
        `Gamepad connected at index ${gp.index}: ${gp.id}. ${gp.buttons.length} buttons, ${gp.axes.length} axes.`
    )
    .join("<br />");
};
export const gamepadConnect = evt => {
  console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    evt.gamepad.index,
    evt.gamepad.id,
    evt.gamepad.buttons.length,
    evt.gamepad.axes.length
  );
  console.log(evt.gamepad.id);
  connectedGamepads.push({
    gamepad: evt.gamepad,
    buttonMap: evt.gamepad.buttons.map((button, index) => ({
      index,
      label: buttonLabels[index],
      state: progress[0], // not pressed, pressed, hold, released
      recentlyUpdated: null
    }))
  });
  console.log("connected game pads:", connectedGamepads);
  renderConnectedGamepadInfo();
  if (!start) {
    start = requestAnimationFrame(gameLoop);
  }
};

export const gamepadDisconnect = evt => {
  console.log("Gamepad disconnected.", evt.gamepad.id);

  connectedGamepads = connectedGamepads.filter(
    gamepad => gamepad !== evt.gamepad
  );
  renderConnectedGamepadInfo();
  if (!!start && connectedGamepads.length === 0) {
    cancelAnimationFrame(start);
    start = undefined;
  }
};
