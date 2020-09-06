import * as Camera from "./engine/camera";
import * as Scene from "./scene";
import * as Editor from "./editor.js";

/**
 * Global game state
 * 0 = not playing
 * 1 = playing
 * 2 = paused
 *
 * @property {0 | 1 | 2} state - game state
 * @property {number} level currently played level
 */
export let gameState = {
  state: 0,
  level: 0,
};

let gl;

let clearScreen = () => gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

export let initGame = (canvas) => {
  gl = canvas.getContext("webgl", { antialias: false });

  Camera.update(gl.canvas.width, gl.canvas.height);
  Scene.init(gl);

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.LEQUAL);
};

export let getCanvasSize = () => [gl.canvas.width, gl.canvas.height];

export let gameLoop = (delta) => {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gameState.state = Scene.update(delta);

  clearScreen();
  Scene.draw(gl);

  return gameState.state === 1;
};

export let editorLoop = (delta) => {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  let proceed = Editor.update(delta);

  clearScreen();
  Editor.draw(gl);

  return proceed;
};
