import { compile, makeBuffer } from "./engine/gl";
import { identity, transform } from "./engine/math";
import { Key } from "./engine/input";
import * as Camera from "./engine/camera";
import { TILEWIDTH, TILEGAP } from "./tile";
import { partialCube, partialCubeNormal } from "./shapes";
import { lightDirection } from "./palette";

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
// TODO: light direction(normal) is hardcoded for now
// TODO: lazily calculated fog, will look ugly when backdrop changes
let fshader = `precision mediump float;
uniform vec3 uLightDir;

varying vec3 vNormal;
varying float vHeight;

void main() {
  float light = dot(normalize(vNormal), uLightDir);
  gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
  gl_FragColor.xyz *= light;
}`;

let buffer,
  SIZE = 10,
  HEIGHT = 40,
  SPEED = 0.1,
  targetPos = [0, 0],
  activePos = [0, 0],
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
  // state = 0 : no key pressed, stationary, taking input
  // state = 1 : key pressed, moving, not taking input
  switch (state) {
    case 0:
      if (Key.up || Key.down || Key.left || Key.right) {
        state = 1;
        if (Key.up) {
          targetPos[1]--;
        } else if (Key.down) {
          targetPos[1]++;
        } else if (Key.left) {
          targetPos[0]--;
        } else if (Key.right) {
          targetPos[0]++;
        }
      }
    case 1:
      let xDisp = 0,
        yDisp = 0;

      if (activePos[0] !== targetPos[0]) {
        activePos[0] < targetPos[0]
          ? ((activePos[0] += SPEED), (xDisp += SPEED))
          : ((activePos[0] -= SPEED), (xDisp -= SPEED));

        if (Math.abs(activePos[0] - targetPos[0]) < 0.01) {
          activePos[0] = targetPos[0];
        }
      } else if (activePos[1] !== targetPos[1]) {
        activePos[1] < targetPos[1]
          ? ((activePos[1] += SPEED), (yDisp += SPEED))
          : ((activePos[1] -= SPEED), (yDisp -= SPEED));

        if (Math.abs(activePos[1] - targetPos[1]) < 0.01) {
          activePos[1] = targetPos[1];
        }
      } else {
        X = targetPos[0];
        Y = targetPos[1];
        state = 0;
      }

      transform(modelView, {
        x: xDisp * (TILEWIDTH + TILEGAP),
        y: yDisp * (TILEWIDTH + TILEGAP),
      });
  }
};

export let load = (gl, parentTransform) => {
  program.use();

  buffer.bind();
  gl.vertexAttribPointer(program.attribs.vertex, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(program.attribs.vertex);

  normalBuffer.bind();
  gl.vertexAttribPointer(program.attribs.normal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(program.attribs.normal);

  gl.uniformMatrix4fv(program.uniforms.parentTransform, false, parentTransform);
  gl.uniformMatrix4fv(
    program.uniforms.projectionMatrix,
    false,
    Camera.projectionMatrix
  );
  gl.uniform3fv(program.uniforms.lightDir, lightDirection);
};

export let draw = (gl) => {
  gl.uniformMatrix4fv(program.uniforms.modelMatrix, false, modelView);
  gl.drawArrays(gl.TRIANGLES, 0, 18);
};

export let initPos = (x, y) => {
  X = targetPos[0] = activePos[0] = x;
  Y = targetPos[1] = activePos[1] = y;
  state = 0;

  modelView = transform(identity(), {
    x: X * TILEWIDTH + TILEGAP * X,
    y: Y * TILEWIDTH + TILEGAP * Y,
    z: -HEIGHT,
  });
};
