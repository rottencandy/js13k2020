import { compile, makeBuffer } from "./engine/gl";
import { identity, transform } from "./engine/math";
import * as Camera from "./engine/camera";

// Vertex shader
let vshader = `
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uParentTransform;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uParentTransform * uModelViewMatrix * aVertexPosition;
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
  platforms = [],
  GAP = 10,
  SIZE = 50;

export let init = (gl) => {
  program = compile(gl, vshader, fshader);
  vertexPos = gl.getAttribLocation(program, "aVertexPosition");
  modelMatrixPos = gl.getUniformLocation(program, "uModelViewMatrix");
  parentTransformPos = gl.getUniformLocation(program, "uParentTransform");
  projectionMatrixPos = gl.getUniformLocation(program, "uProjectionMatrix");

  buffer = makeBuffer(gl, gl.ARRAY_BUFFER, [
    0,
    0, // top left
    0,
    SIZE, // bottom left
    SIZE,
    0, // top right
    SIZE,
    SIZE, // bottom right
  ]);
};

export let setupTiles = (width, height) => {
  platforms = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      platforms.push({
        modelView: transform(identity(), {
          x: x * SIZE + GAP * x,
          y: y * SIZE + GAP * y,
        }),
      });
    }
  }
};

export let load = (gl) => {
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(vertexPos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPos);
};

export let draw = (gl, parentTransform) => {
  gl.uniformMatrix4fv(parentTransformPos, false, parentTransform);
  gl.uniformMatrix4fv(projectionMatrixPos, false, Camera.projectionMatrix);

  platforms.forEach((tile) => {
    gl.uniformMatrix4fv(modelMatrixPos, false, tile.modelView);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  });
};