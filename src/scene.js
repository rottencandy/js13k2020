import * as Platform from "./platform";
import * as Backdrop from "./backdrop";
import { Key } from "./engine/input";

let pauseNextIteration = false;

export let init = (gl) => {
  Backdrop.init(gl);
  Platform.init(gl);
};

export let loadLevel = Platform.loadLevel;

// used to pause through UI
export let pauseScene = () => (pauseNextIteration = true);

export let update = () => {
  if (Key.esc || pauseNextIteration) {
    pauseNextIteration = false;
    return 2;
  }
  return Platform.update();
};

export let draw = (gl) => {
  Backdrop.draw(gl);
  Platform.draw(gl);
};
