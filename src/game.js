export let state = {
  hasCoil: false,
  lives: 0,
  score: 0,
};

// detect coil subscription
//document.monetization.addEventListener('monetizationstart', function() {
//  state.hasCoil = true;
//});

let gl;

export let init = (canvas) => {
  gl = canvas.getContext("webgl", { antialias: false });
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

export let update = (_delta) => {
  resize();
};

export let draw = () => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};
