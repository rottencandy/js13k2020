import { compile, makeBuffer } from "./engine/gl";
import { identity, transform } from "./engine/math";
import { Key } from "./engine/input";
import * as Camera from "./engine/camera";
import {
  gridWidth,
  gridHeight,
  TILESIZE,
  TILEGAP,
  playerInitPos,
} from "./platform";

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
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;

let program,
  modelMatrixPos,
  projectionMatrixPos,
  parentTransformPos,
  buffer,
  vertexPos,
  SIZE = 10,
  modelView = identity();

export let playerX, playerY;

export let init = (gl) => {
  program = compile(gl, vshader, fshader);

  buffer = makeBuffer(gl, gl.ARRAY_BUFFER, [
    0,
    0, // top left
    0,
    SIZE, // botom left
    SIZE,
    0, // top right
    SIZE,
    SIZE, // bottom right
  ]);

  vertexPos = gl.getAttribLocation(program, "aVertexPosition");
  modelMatrixPos = gl.getUniformLocation(program, "uModelViewMatrix");
  parentTransformPos = gl.getUniformLocation(program, "uParentTransform");
  projectionMatrixPos = gl.getUniformLocation(program, "uProjectionMatrix");
  // accomodate for GAP
  // TODO this shoul ideally be done using platform size
  modelView = transform(modelView, { x: 20, y: 20, z: -0.1 });
  [playerX, playerY] = playerInitPos;
};

export let update = (delta) => {
  if (Key.up) {
    if (playerY > 0) {
      playerY--;
      modelView = transform(modelView, {
        y: playerY * TILESIZE,
      });
    }
  } else if (Key.down) {
    if (playerY < gridHeight) {
      playerY++;
      modelView = transform(modelView, {
        y: playerY * TILESIZE,
      });
    }
  } else if (Key.left) {
    if (playerX > 0) {
      playerX--;
      modelView = transform(modelView, {
        y: playerX * TILESIZE,
      });
    }
  } else if (Key.right) {
    if (playerX < gridWidth) {
      playerX++;
      modelView = transform(modelView, {
        y: playerX * TILESIZE,
      });
    }
  }
};

export let load = (gl, parentTransform) => {
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(vertexPos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPos);
  gl.uniformMatrix4fv(parentTransformPos, false, parentTransform);
  gl.uniformMatrix4fv(projectionMatrixPos, false, Camera.projectionMatrix);
};

export let draw = (gl) => {
  gl.uniformMatrix4fv(modelMatrixPos, false, modelView);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
