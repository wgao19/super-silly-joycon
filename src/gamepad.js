const buttonPressed = key => {
  if (typeof key === "object") {
    return key.pressed;
  }
  return false;
};

let start,
  connectedGamepads = [];

const progress = ["not pressed", "pressed", "hold", "released"];
const buttonX = {
  state: progress[0], // not pressed, pressed, hold, released
  recentlyUpdated: null
};

const THRESHOLD = 300;

const update = gamepad => {
  // test button pressed
  const buttonDisplays = document.getElementsByClassName("button-display");
  for (let i = 0; i < buttonDisplays.length; i++) {
    buttonDisplays[
      i
    ].innerHTML = `pressed button ${i}: ${gamepad.buttons[i].pressed}`;
  }
  const pressedX = gamepad.buttons[1].pressed;
  const currentState = buttonX.state;
  if (pressedX) {
    switch (currentState) {
      case "not pressed":
      case "released": {
        // change from not pressed to pressed and update timestamp
        buttonX.state = "pressed";
        buttonX.recentlyUpdated = +new Date();
        break;
      }
      case "pressed": {
        // already pressed, do not change unless it's passed threashold
        if (+new Date() - buttonX.recentlyUpdated > THRESHOLD) {
          buttonX.state = "hold";
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
    switch (buttonX.state) {
      case "pressed":
      case "hold": {
        buttonX.state = "released";
        buttonX.recentlyUpdated = +new Date();
        break;
      }
      case "released": {
        if (+new Date() - buttonX.recentlyUpdated > THRESHOLD) {
          buttonX.state = "not pressed";
        }
        break;
      }
      case "not pressed":
      default: {
        // do nothing
      }
    }
  }
  document.getElementById("button-x-display").innerHTML = buttonX.state;
};

const gameLoop = () => {
  if (connectedGamepads.length > 0) {
    connectedGamepads.forEach(gamepad => {
      update(gamepad);
    });
  }
  requestAnimationFrame(gameLoop);
};

const renderConnectedGamepadInfo = () => {
  document.getElementById("gamepad-display").innerHTML = connectedGamepads
    .map(
      gp =>
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
  connectedGamepads.push(evt.gamepad);
  console.log("connected game pads:", connectedGamepads);
  renderConnectedGamepadInfo();
  if (!start) {
    start = requestAnimationFrame(gameLoop);
  }
};

export const gamepadDisconnect = evt => {
  console.log("Gamepad disconnected.", evt.gamepad.id);
  // var gamepads = navigator.getGamepads
  //   ? navigator.getGamepads()
  //   : navigator.webkitGetGamepads
  //   ? navigator.webkitGetGamepads
  //   : [];

  connectedGamepads = connectedGamepads.filter(
    gamepad => gamepad !== evt.gamepad
  );
  renderConnectedGamepadInfo();
  if (!!start && connectedGamepads.length === 0) {
    cancelAnimationFrame(gameLoop);
    start = undefined;
  }
};
