import { compile, makeBuffer } from "./engine/gl";
import { identity, transform } from "./engine/math";
import * as Camera from "./engine/camera";
import * as Player from "./player";

// Vertex shader
let vshader = `
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}`;

// Fragment shader
let fshader = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

let program,
  modelMatrixPos,
  projectionMatrixPos,
  buffer,
  vertexPos,
  modelView = identity();

export let init = (gl) => {
  program = compile(gl, vshader, fshader);
  vertexPos = gl.getAttribLocation(program, "aVertexPosition");
  modelMatrixPos = gl.getUniformLocation(program, "uModelViewMatrix");
  projectionMatrixPos = gl.getUniformLocation(program, "uProjectionMatrix");

  buffer = makeBuffer(gl, gl.ARRAY_BUFFER, [
    0,
    0, // top left
    0,
    500, // bottom left
    500,
    0, // top right
    500,
    500, // bottom right
  ]);
  modelView = transform(modelView, { z: 5 });

  // Initialize children nodes
  Player.init(gl);
};

export let update = (delta) => {
  // Update children nodes
  Player.update(delta);
};

export let draw = (gl) => {
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(vertexPos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPos);

  gl.uniformMatrix4fv(modelMatrixPos, false, modelView);
  gl.uniformMatrix4fv(projectionMatrixPos, false, Camera.projectionMatrix);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // Draw children nodes
  Player.draw(gl);
};
