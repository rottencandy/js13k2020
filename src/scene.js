import * as Platform from "./platform";
import { identity } from "./engine/math";

let transformMatrix = identity();
export let init = (gl) => {
  Platform.init(gl);
  Platform.setupTiles(3, 5);
};

export let update = (_delta) => {};

export let draw = (gl) => {
  Platform.load(gl);
  Platform.draw(gl, transformMatrix);
};
