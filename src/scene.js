import * as Camera from "./engine/camera";
import { Key } from "./engine/input";
import * as Platform from "./platform";
import * as Backdrop from "./backdrop";

let pauseNextIteration = false;

export let init = (gl, width, height) => {
  Backdrop.init(gl);
  Platform.init(gl, width, height);
};

export let loadLevel = Platform.loadLevel;

// used to pause through UI
export let pauseScene = () => (pauseNextIteration = true);

export let update = () => {
  if (Key.esc || pauseNextIteration) {
    pauseNextIteration = false;
    return 2;
  }
  if (Key.mouse.down) {
    Camera.move(Key.mouse.x, Key.mouse.y);
    Key.mouse.x = Key.mouse.y = 0;
  }
  return Platform.update();
};

export let draw = (gl, time) => {
  Backdrop.draw(gl, time);
  Platform.draw(gl);
};
