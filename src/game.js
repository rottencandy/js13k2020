import { identity, perspective } from "./engine/math";
import * as Scene from "./scene";
export let state = {
  hasCoil: false,
  lives: 0,
  score: 0,
};

// detect coil subscription
//document.monetization.addEventListener('monetizationstart', function() {
//  state.hasCoil = true;
//});

let gl,
  projection = identity(),
  aspect,
  fov = (45 * Math.PI) / 180, // in radians
  zNear = 0.1,
  zFar = 100.0;

export let init = (canvas) => {
  gl = canvas.getContext("webgl", { antialias: false });
  aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  Scene.init(gl);

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.LEQUAL);
};

let resize = () => {
  let width = gl.canvas.clientWidth;
  let height = gl.canvas.clientHeight;
  if (gl.canvas.width != width || gl.canvas.height != height) {
    gl.canvas.width = width;
    gl.canvas.height = height;
  }
};

export let update = (delta) => {
  resize();
  Scene.update(delta);
};

export let draw = () => {
  projection = perspective(projection, fov, aspect, zNear, zFar);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  Scene.draw(gl, projection);
};
