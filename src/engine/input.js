export let Key = { up: false, right: false, down: false, left: false };

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
};
