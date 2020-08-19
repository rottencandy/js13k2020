import { identity, orthographic, multMat4Mat4 } from "./math";

export let projectionMatrix = identity();

export let update = (width, height) => {
  projectionMatrix = orthographic(0, width, height, 0, 100, -100);
};

export let lookAt = (inverseMatrix) => {
  projectionMatrix = multMat4Mat4(projectionMatrix, inverseMatrix);
};
