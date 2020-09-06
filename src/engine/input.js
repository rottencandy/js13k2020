export let Key = {
  up: false,
  right: false,
  down: false,
  left: false,
  esc: false,
  mouse: { down: false, x: 0, y: 0 },
};

// Keydown listener
onkeydown = (e) => {
  let keycode = e.keyCode;
  // Up (up / W / Z)
  if (keycode == 38 || keycode == 90 || keycode == 87) {
    Key.up = true;
  }

  // Right (right / D)
  if (keycode == 39 || keycode == 68) {
    Key.right = true;
  }

  // Down (down / S)
  if (keycode == 40 || keycode == 83) {
    Key.down = true;
  }

  // Left (left / A / Q)
  if (keycode == 37 || keycode == 65 || keycode == 81) {
    Key.left = true;
  }

  // Esc
  if (keycode == 27) {
    Key.esc = true;
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
};

// For handling mouse drag events
let canvas = document.getElementById("app"),
  x = 0,
  y = 0;
canvas.onmousedown = (e) => {
  Key.mouse.down = true;
  x = e.offsetX;
  y = e.offsetY;
};
canvas.onmouseup = () => {
  Key.mouse.down = false;
  Key.mouse.x = Key.mouse.y = 0;
};
canvas.onmousemove = (e) => {
  Key.mouse.x = Key.mouse.y = 0;
  if (Key.mouse.down) {
    Key.mouse.x = e.offsetX - x;
    Key.mouse.y = e.offsetY - y;
    x = e.offsetX;
    y = e.offsetY;
  }
};
