import * as Camera from "./engine/camera";
import * as Scene from "./scene";
import * as Editor from "./editor.js";

/**
 * Global game state
 * 0 = not playing
 * 1 = playing
 * 2 = paused
 * 3 = in level editor
 *
 * @property {0 | 1 | 2 | 3} state - game state
 * @property {number} level currently played level
 * @property {boolean} hasCoil coil subscription state
 */
export let gameState = {
  hasCoil: false,
  editedLevel: false,
  state: 0,
  level: 0,
};

export let checkMonetization = () => {
  gameState.hasCoil ||
    (document.monetization &&
      document.monetization.addEventListener("monetizationstart", function () {
        gameState.hasCoil = true;
      }));
};

let gl;

let clearScreen = () => gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

export let initGame = (canvas) => {
  gl = canvas.getContext("webgl", { antialias: false });

  Camera.update(gl.canvas.width, gl.canvas.height);
  Scene.init(gl);
  Editor.init(gl);

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
  gameState.state = Editor.update(delta);

  clearScreen();
  Editor.draw(gl);

  return gameState.state === 3;
};
