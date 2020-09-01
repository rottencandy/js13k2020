import { compile, makeBuffer } from "./engine/gl";
import { identity, transform } from "./engine/math";
import { Key } from "./engine/input";
import * as Camera from "./engine/camera";
import { TILEWIDTH, TILEGAP } from "./tile";

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

let buffer,
  gridWidth,
  SIZE = 10,
  modelView = identity();

export let playerX = 0,
  playerY = 0,
  state = 0;

export let initPos = (x, y, width) => {
  playerX = x;
  playerY = y;
  gridWidth = width;

  modelView = transform(identity(), {
    x: playerX * TILEWIDTH + TILEGAP * playerX,
    y: playerY * TILEWIDTH + TILEGAP * playerY,
    z: -0.1,
  });
};

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
        if (playerY < gridWidth - 1) {
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

      transform(modelView, {
        x: moveX * TILEWIDTH + TILEGAP * moveX,
        y: moveY * TILEWIDTH + TILEGAP * moveY,
      });
    }
  } else {
    state = 0;
  }
};

export let load = (gl, parentTransform) => {
  program.use();
  buffer.bind();
  gl.vertexAttribPointer(program.attribs.vertex, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(program.attribs.vertex);
  gl.uniformMatrix4fv(program.uniforms.parentTransform, false, parentTransform);
  gl.uniformMatrix4fv(
    program.uniforms.projectionMatrix,
    false,
    Camera.projectionMatrix
  );
};

export let draw = (gl) => {
  gl.uniformMatrix4fv(program.uniforms.modelMatrix, false, modelView);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
