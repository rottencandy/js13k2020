import * as Platform from "./platform";

export let init = (gl) => {
  Platform.init(gl);
};

export let loadLevel = Platform.loadLevel;

export let update = (delta) => {
  return Platform.update(delta);
};

export let draw = (gl) => {
  Platform.draw(gl);
};
