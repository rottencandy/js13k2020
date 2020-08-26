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

export let playerX,
  playerY,
  state = 0;

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

  [playerX, playerY] = playerInitPos;

  modelView = transform(modelView, {
    x: playerX * TILESIZE + TILEGAP * playerX,
    y: playerY * TILESIZE + TILEGAP * playerY,
    z: -0.1,
  });
};

export let update = (_delta) => {
  let moveX = 0,
    moveY = 0;
  // state = 0 : no key pressed, stationary
  // state = 1 : key pressed, moving
  if (Key.up || Key.down || Key.left || Key.right) {
    if (state === 0) {
      state = 1;
      if (Key.up) {
        if (playerY > 0) {
          playerY--;
          moveY--;
        }
      } else if (Key.down) {
        if (playerY < gridHeight - 1) {
          playerY++;
          moveY++;
        }
      } else if (Key.left) {
        if (playerX > 0) {
          playerX--;
          moveX--;
        }
      } else if (Key.right) {
        if (playerX < gridWidth - 1) {
          playerX++;
          moveX++;
        }
      }

      modelView = transform(modelView, {
        x: moveX * TILESIZE + TILEGAP * moveX,
        y: moveY * TILESIZE + TILEGAP * moveY,
      });
    }
  } else {
    state = 0;
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
