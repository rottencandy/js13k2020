import { compile, makeBuffer } from "./engine/gl";
import { identity, transform } from "./engine/math";
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
  modelMatrixPos = gl.getUniformLocation(program, "uModelViewMatrix");
  projectionMatrixPos = gl.getUniformLocation(program, "uProjectionMatrix");
  vertexPos = gl.getAttribLocation(program, "aVertexPosition");

  buffer = makeBuffer(gl, gl.ARRAY_BUFFER, [
    -1.0,
    1.0, // top left
    -1.0,
    -1.0, // bottom left
    1.0,
    1.0, // top right
    1.0,
    -1.0, // bottom right
  ]);
  modelView = transform(modelView, { z: -2, sx: 2.0, sy: 2.0 });

  // Initialize children nodes
  Player.init(gl);
};

export let update = (delta) => {
  // Update children nodes
  Player.update(delta);
};

export let draw = (gl, projection) => {
  gl.useProgram(program);

  gl.uniformMatrix4fv(modelMatrixPos, false, modelView);
  gl.uniformMatrix4fv(projectionMatrixPos, false, projection);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(vertexPos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPos);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  // Draw children nodes
  Player.draw(gl, projection, modelView);
};
