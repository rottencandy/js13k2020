import * as Platform from "./platform";
import * as Backdrop from "./backdrop";

export let init = (gl) => {
  Backdrop.init(gl);
  Platform.init(gl);
};

export let loadLevel = Platform.loadLevel;

export let update = (delta) => Platform.update(delta);

export let draw = (gl) => {
  Backdrop.draw(gl);
  Platform.draw(gl);
};
