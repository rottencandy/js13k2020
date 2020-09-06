import * as Platform from "./platform";
import * as Backdrop from "./backdrop";
import { Key } from "./engine/input";

export let init = (gl) => {
  Backdrop.init(gl);
  Platform.init(gl);
};

export let loadLevel = Platform.loadLevel;

export let update = (delta) => {
  if (Key.esc) {
    return 2;
  }
  return Platform.update(delta);
};

export let draw = (gl) => {
  Backdrop.draw(gl);
  Platform.draw(gl);
};
