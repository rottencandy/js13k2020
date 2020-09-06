import { identity, orthographic, transform } from "./math";

export let projectionMatrix = identity();

export let update = (width, height) => {
  projectionMatrix = identity();
  projectionMatrix = orthographic(0, width, height, 0, 2000, -2000);
};

export let move = (x, y) => {
  transform(projectionMatrix, { x, y });
};
