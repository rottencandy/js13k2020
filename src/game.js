import * as Camera from "./engine/camera";
import * as Scene from "./scene";
export let state = {
  hasCoil: false,
  lives: 0,
  score: 0,
};

let gl;

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

export let gameLoop = (delta) => {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  Scene.update(delta);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  Scene.draw(gl);

  return 1;
};
