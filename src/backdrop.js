import { compile, makeBuffer } from "./engine/gl";

let vertexBuffer, program;

let vshader = `attribute vec2 aVertexPosition;
varying vec2 vST;

void main() {
  gl_Position = vec4(aVertexPosition.xy, 0.9, 1.0);
  vST = (aVertexPosition+1.0)/2.0;
}`;

let fshader = `precision mediump float;
varying vec2 vST;

void main() {
  gl_FragColor = vec4(0.7, 0.7, 0.7, 1.0);
}`;

export let init = (gl) => {
  program = compile(gl, vshader, fshader);
  vertexBuffer = makeBuffer(gl, gl.ARRAY_BUFFER, [-1, 1, -1, -1, 1, 1, 1, -1]);
};

export let draw = (gl) => {
  program.use();

  vertexBuffer.bind(2, program.attribs.vertex);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
