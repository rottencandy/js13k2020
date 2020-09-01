import { identity, orthographic, multMat4Mat4 } from "./math";

export let projectionMatrix = identity();

export let update = (width, height) => {
  projectionMatrix = orthographic(0, width, height, 0, 2000, -2000);
};

export let lookAt = (inverseMatrix) => {
  multMat4Mat4(projectionMatrix, inverseMatrix);
};
