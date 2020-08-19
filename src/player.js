import { compile, makeBuffer } from "./engine/gl";
import { identity, transform } from "./engine/math";
import * as Camera from "./engine/camera";

// Vertex shader
let vshader = `
attribute vec4 aVertexPosition;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}`;

// Fragment shader
let fshader = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;

export let InverseMatrix;

let program,
  modelMatrixPos,
  projectionMatrixPos,
  buffer,
  vertexPos,
  modelView = identity();

export let init = (gl) => {
  program = compile(gl, vshader, fshader);
  modelMatrixPos = gl.getUniformLocation(program, "uModelViewMatrix");
  projectionMatrixPos = gl.getUniformLocation(program, "uProjectionMatrix");
  vertexPos = gl.getAttribLocation(program, "aVertexPosition");

  buffer = makeBuffer(gl, gl.ARRAY_BUFFER, [
    50,
    0, // top
    0,
    100, // left
    100,
    100, // right
  ]);

  modelView = transform(modelView, { x: -50, y: -50 });
};

export let update = (delta) => {
  modelView = transform(modelView, { y: -1 * delta });
  Camera.lookAt(transform(identity(), {y: 1 * delta}));
};

export let draw = (gl) => {
  gl.useProgram(program);

  gl.uniformMatrix4fv(modelMatrixPos, false, modelView);
  gl.uniformMatrix4fv(projectionMatrixPos, false, Camera.projectionMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(vertexPos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPos);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
