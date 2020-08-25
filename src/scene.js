import * as Platform from "./platform";
import { identity } from "./engine/math";

let transformMatrix = identity();
export let init = (gl) => {
  Platform.init(gl);
  Platform.decodeLevel("3:5:2a4b6c4d");
  Platform.load(gl);
};

export let update = (_delta) => {};

export let draw = (gl) => {
  Platform.draw(gl, transformMatrix);
};
