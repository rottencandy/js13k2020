import { identity, transform } from "./engine/math";
import { Key } from "./engine/input";
import * as Camera from "./engine/camera";
import { compile, makeBuffer } from "./engine/gl";
import { TILEWIDTH, TILEGAP } from "./tile";

export let X = 0,
  Y = 0,
  modelView = identity(),
  state = 0,
  SPEED = 0.1,
  pos = [0, 0],
  nextPos = [0, 0],
  program,
  buffer;

export let reset = () => {
  state = 0;
  modelView = identity();
  platforms = [];
  X = 0;
  Y = 0;
  pos = [0, 0];
  nextPos = [0, 0];
};

export let setContextPos = (x, y) => {
  X = x;
  Y = y;
  pos = [x, y];
  nextPos = [x, y];
};

// Vertex shader
let vshader = `attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uParentTransform;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uParentTransform * uModelViewMatrix * aVertexPosition;
}`;

// Fragment shader
let fshader = `precision mediump float;
void main() {
  gl_FragColor = vec4(1.,1.,1.,1.);
}`;

export let init = (gl) => {
  program = compile(gl, vshader, fshader);

  buffer = makeBuffer(gl, gl.ARRAY_BUFFER, [
    0,
    0,
    TILEWIDTH,
    0,
    TILEWIDTH,
    TILEWIDTH,
    0,
    TILEWIDTH,
  ]);
};

export let update = () => {
  switch (state) {
    // wait for input
    case 0:
      if (Key.up || Key.down || Key.left || Key.right) {
        state = 1;
        if (Key.up) {
          nextPos[1]--;
        } else if (Key.down) {
          nextPos[1]++;
        } else if (Key.left) {
          nextPos[0]--;
        } else if (Key.right) {
          nextPos[0]++;
        }
      }
      break;

    // move selector to next position
    case 1:
      let xDisp = 0,
        yDisp = 0;

      // move in X
      if (pos[0] !== nextPos[0]) {
        pos[0] < nextPos[0]
          ? ((pos[0] += SPEED), (xDisp += SPEED))
          : ((pos[0] -= SPEED), (xDisp -= SPEED));

        // too small values don't matter
        if (Math.abs(pos[0] - nextPos[0]) < 0.01) {
          pos[0] = nextPos[0];
        }
        // move in Y
      } else if (pos[1] !== nextPos[1]) {
        pos[1] < nextPos[1]
          ? ((pos[1] += SPEED), (yDisp += SPEED))
          : ((pos[1] -= SPEED), (yDisp -= SPEED));

        if (Math.abs(pos[1] - nextPos[1]) < 0.01) {
          pos[1] = nextPos[1];
        }
        // moved, we can proceed
      } else {
        X = nextPos[0];
        Y = nextPos[1];
        state = 0;
      }
      transform(modelView, {
        x: xDisp * (TILEWIDTH + TILEGAP),
        y: yDisp * (TILEWIDTH + TILEGAP),
      });
  }
};

export let draw = (gl, parentTransform) => {
  program.use();
  buffer.bind(2, program.attribs.vertex);
  gl.uniformMatrix4fv(program.uniforms.parentTransform, false, parentTransform);
  gl.uniformMatrix4fv(
    program.uniforms.projectionMatrix,
    false,
    Camera.projectionMatrix
  );
  gl.uniformMatrix4fv(program.uniforms.modelMatrix, false, modelView);
  gl.drawArrays(gl.LINE_LOOP, 0, 4);
};
