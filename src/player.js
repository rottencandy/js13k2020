import { compile, makeBuffer } from "./engine/gl";
import { identity, transform } from "./engine/math";
import { Key } from "./engine/input";
import * as Camera from "./engine/camera";
import { TILEWIDTH, TILEGAP } from "./tile";
import { partialCube, partialCubeNormal } from "./shapes";
import { lightDirection, playerColor } from "./palette";
import { moveSound } from "./sound/sounds";

// Vertex shader
// TODO: hardcoded height value
let vshader = `attribute vec4 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uParentTransform;
uniform mat4 uProjectionMatrix;

varying vec3 vNormal;
varying float vHeight;

void main() {
  gl_Position = uProjectionMatrix * uParentTransform * uModelViewMatrix * aVertexPosition;
  vNormal = aNormal;
  vHeight = (1.-aVertexPosition.z/40.0);
}`;

// Fragment shader
let fshader = `precision mediump float;
uniform vec3 uLightDir;
uniform vec3 uColor;
uniform float uJump;

varying vec3 vNormal;
varying float vHeight;

void main() {
  float light = dot(normalize(vNormal), uLightDir);
  float glow = step(vHeight, uJump);
  gl_FragColor = mix(vec4(0.5, 0.5, 0.5, 1.0), vec4(0.9,1.,0.9,1.), glow);
  gl_FragColor.xyz *= light;
}`;

let buffer,
  SIZE = 10,
  HEIGHT = 40,
  SPEED = 0.09,
  targetPos = [0, 0],
  activePos = [0, 0],
  Z = 0,
  jump = 0,
  modelView = identity();

export let X = 0,
  Y = 0,
  state = 0;

export let init = (gl) => {
  program = compile(gl, vshader, fshader);

  buffer = makeBuffer(gl, gl.ARRAY_BUFFER, partialCube(SIZE, HEIGHT));
  normalBuffer = makeBuffer(gl, gl.ARRAY_BUFFER, partialCubeNormal());
};

export let update = (_delta) => {
  // state = 0 : initialize and run start animation
  // state = 1 : no key pressed, stationary, taking input
  // state = 2 : input registered, moving, not taking input
  // state = 3 : end animation
  // state = 4 : dummy state to wait for end of key press
  switch (state) {
    case 0:
      transform(modelView, {
        z: -1,
      });
      Z--;
      if (Z <= -HEIGHT) {
        state = 4;
        Z = 0;
      }
      break;

    case 1:
      if (Key.up || Key.down || Key.left || Key.right) {
        let stride = 1;
        moveSound(jump);
        if (jump++ > 2) {
          stride = 2;
          jump = 0;
        }
        state = 2;
        if (Key.up) {
          targetPos[1] -= stride;
        } else if (Key.down) {
          targetPos[1] += stride;
        } else if (Key.left) {
          targetPos[0] -= stride;
        } else if (Key.right) {
          targetPos[0] += stride;
        }
      }
      break;

    case 2:
      let xDisp = 0,
        yDisp = 0;

      if (activePos[0] !== targetPos[0]) {
        activePos[0] < targetPos[0]
          ? ((activePos[0] += SPEED), (xDisp += SPEED))
          : ((activePos[0] -= SPEED), (xDisp -= SPEED));

        // sanity check, ignore very small distances
        if (Math.abs(activePos[0] - targetPos[0]) < 0.05) {
          activePos[0] = targetPos[0];
        }
      } else if (activePos[1] !== targetPos[1]) {
        activePos[1] < targetPos[1]
          ? ((activePos[1] += SPEED), (yDisp += SPEED))
          : ((activePos[1] -= SPEED), (yDisp -= SPEED));

        // sanity check, ignore very small distances
        if (Math.abs(activePos[1] - targetPos[1]) < 0.05) {
          activePos[1] = targetPos[1];
        }
      } else {
        X = targetPos[0];
        Y = targetPos[1];
        state = 4;
      }

      transform(modelView, {
        x: xDisp * (TILEWIDTH + TILEGAP),
        y: yDisp * (TILEWIDTH + TILEGAP),
      });
      break;

    case 3:
      transform(modelView, {
        z: Z++,
      });
      // done falling
      if (Z > 50) {
        Z = 0;
        return 1;
      }
      break;

    case 4:
      if (!(Key.up || Key.down || Key.left || Key.right)) {
        state = 1;
      }
  }
};

export let fall = () => ((state = 3), (jump = 0));

export let load = (gl, parentTransform) => {
  program.use();

  buffer.bind(3, program.attribs.vertex);
  normalBuffer.bind(3, program.attribs.normal);

  gl.uniformMatrix4fv(program.uniforms.parentTransform, false, parentTransform);
  gl.uniformMatrix4fv(
    program.uniforms.projectionMatrix,
    false,
    Camera.projectionMatrix
  );
  gl.uniform3fv(program.uniforms.lightDir, lightDirection);
  gl.uniform3fv(program.uniforms.color, playerColor);
  gl.uniform1f(program.uniforms.jump, jump / 3);
};

export let draw = (gl) => {
  gl.uniformMatrix4fv(program.uniforms.modelMatrix, false, modelView);
  gl.drawArrays(gl.TRIANGLES, 0, 18);
};

export let initPos = (x, y) => {
  X = targetPos[0] = activePos[0] = x;
  Y = targetPos[1] = activePos[1] = y;
  state = Z = jump = 0;

  // Looks scary but really isn't
  modelView = transform(identity(), {
    x: X * TILEWIDTH + TILEGAP * X + TILEWIDTH / 2 - SIZE / 2,
    y: Y * TILEWIDTH + TILEGAP * Y + TILEWIDTH / 2 - SIZE / 2,
    z: 0,
  });
};
