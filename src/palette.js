import { floor } from "./engine/math";

export let lightDirection = [-0.5, 0.8, -1.0];

export let tileColor = {
  // start tile, behaves similar to "b"
  x: [0.061, 0.581, 0.821],
  // basic non-interactive tile
  b: [0.939, 0.131, 0.125],
  // destination tile
  c: [0.502, 0.847, 0.412],
  // one step tile
  d: [0.91, 0.82, 0.14],
};

export let playerColor = [0.44, 0.525, 0.627];
export let playerGlowColor = [0.933, 0.894, 0.882];

export let backdropBase = [0.583, 0.644, 0.752];

export let setBackdropColor = (val) => {
  backdropBase = val;
};

// source: https://stackoverflow.com/a/5624139/7683374
export let rgbToHex = ([r, g, b]) =>
  "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
export let denormalize = ([r, g, b]) => [
  floor(r * 255),
  floor(g * 255),
  floor(b * 255),
];
