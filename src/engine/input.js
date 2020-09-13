export let Key = {
  up: false,
  right: false,
  down: false,
  left: false,
  esc: false,
  space: false,
  mouse: { down: false, x: 0, y: 0 },
};

export let keyCodes = {
  left: 37,
  right: 39,
  up: 38,
  down: 40,
  space: 32,
};

// Keydown listener
onkeydown = (e) => {
  let keycode = e.keyCode;
  let preventMovement = () => e.preventDefault && e.preventDefault();
  // Up (up / W / Z)
  if (keycode == 38 || keycode == 90 || keycode == 87) {
    Key.up = true;
    preventMovement();
  }

  // Right (right / D)
  if (keycode == 39 || keycode == 68) {
    Key.right = true;
    preventMovement();
  }

  // Down (down / S)
  if (keycode == 40 || keycode == 83) {
    Key.down = true;
    preventMovement();
  }

  // Left (left / A / Q)
  if (keycode == 37 || keycode == 65 || keycode == 81) {
    Key.left = true;
    preventMovement();
  }

  // Esc
  if (keycode == 27) {
    Key.esc = true;
    preventMovement();
  }

  // space
  if (keycode == 32) {
    Key.space = true;
    preventMovement();
  }
};

// Keyup listener
onkeyup = (e) => {
  let keycode = e.keyCode;
  // Up
  if (keycode == 38 || keycode == 90 || keycode == 87) {
    Key.up = false;
  }

  // Right
  if (keycode == 39 || keycode == 68) {
    Key.right = false;
  }

  // Down
  if (keycode == 40 || keycode == 83) {
    Key.down = false;
  }

  // Left
  if (keycode == 37 || keycode == 65 || keycode == 81) {
    Key.left = false;
  }

  // Esc
  if (keycode == 27) {
    Key.esc = false;
  }

  // space
  if (keycode == 32) {
    Key.space = false;
  }
};

// For handling mouse drag and touch events
let canvas = document.getElementById("app"),
  x = 0,
  y = 0;
canvas.onpointerdown = (e) => {
  Key.mouse.down = true;
  x = e.offsetX;
  y = e.offsetY;
};
canvas.onpointerup = () => {
  Key.mouse.down = false;
  Key.mouse.x = Key.mouse.y = 0;
};
canvas.onpointermove = (e) => {
  Key.mouse.x = Key.mouse.y = 0;
  if (Key.mouse.down) {
    Key.mouse.x = e.offsetX - x;
    Key.mouse.y = e.offsetY - y;
    x = e.offsetX;
    y = e.offsetY;
  }
};
