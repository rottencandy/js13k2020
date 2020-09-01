import * as Platform from "./platform";

export let update = (delta) => {
  return 1;
};

export let draw = (gl) => {
  Platform.loadBuffers(gl);
};
