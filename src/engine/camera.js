import { identity, orthographic, multMat4Mat4 } from "./math";

export let projectionMatrix = identity();

export let update = (width, height) => {
  projectionMatrix = orthographic(0, width, height, 0, 500, -500);
};

export let lookAt = (inverseMatrix) => {
  projectionMatrix = multMat4Mat4(projectionMatrix, inverseMatrix);
};
