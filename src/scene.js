import * as Platform from "./platform";
import * as Player from "./player";
import { identity } from "./engine/math";

let transformMatrix = identity();
export let init = (gl) => {
  Platform.init(gl);
  Player.init(gl);
  Platform.decodeLevel("3:5:2a4b6c4d");
};

export let update = (delta) => {
  Player.update(delta);
};

export let draw = (gl) => {
  Platform.load(gl, transformMatrix);
  Platform.draw(gl);

  Player.load(gl, transformMatrix);
  Player.draw(gl);
};
