import { identity, perspective, transform } from "./math";
import { velocity, drift, rot } from "../player";

export let projection = identity();
let FOV = (45 * Math.PI) / 180, // in radians
  NEAR = 0.1,
  FAR = 100.0;
export let init = (aspect) => {
  projection = perspective(projection, FOV, aspect, NEAR, FAR);
};

export let update = (aspect) => {
  projection = transform(projection, { y: -velocity });
};
