import * as Platform from "./platform";
import { identity } from "./engine/math";

let transformMatrix = identity();
export let init = (gl) => {
  Platform.init(gl);
  Platform.loadLevel("3:5:ab4c6d4e");
};

export let update = (delta) => {
  Platform.update(delta);
};

export let draw = (gl) => {
  Platform.draw(gl, transformMatrix);
};
