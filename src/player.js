import { compile, makeBuffer } from "./engine/gl";
import { identity, transform } from "./engine/math";
import { Key } from "./engine/input";

// Vertex shader
let vshader = `
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uParentMatrix;

void main() {
  gl_Position = uProjectionMatrix * uParentMatrix * uModelViewMatrix * aVertexPosition;
}`;

// Fragment shader
let fshader = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;

export let velocity = 0,
  drift = 0,
  rot = 0;

let program,
  modelMatrixPos,
  projectionMatrixPos,
  parentMatrixPos,
  buffer,
  vertexPos,
  modelView = identity(),
  ACCEL = 1.5,
  DECEL = 1,
  MAXVEL = 3;

export let init = (gl) => {
  program = compile(gl, vshader, fshader);
  modelMatrixPos = gl.getUniformLocation(program, "uModelViewMatrix");
  projectionMatrixPos = gl.getUniformLocation(program, "uProjectionMatrix");
  parentMatrixPos = gl.getUniformLocation(program, "uParentMatrix");
  vertexPos = gl.getAttribLocation(program, "aVertexPosition");

  buffer = makeBuffer(gl, gl.ARRAY_BUFFER, [
    0.0,
    1.0, // top
    -1.0,
    -1.0, // left
    1.0,
    -1.0, // right
  ]);
  modelView = transform(modelView, { z: 1, sx: 0.01, sy: 0.01 });
};

export let update = (delta) => {
  rot = 0;
  if (Key.up) {
    velocity += ACCEL * delta;
  } else if (velocity > 0) {
    velocity -= DECEL * delta;
    if (velocity > MAXVEL) {
      velocity = MAXVEL;
    }
  } else {
    // Safety net for negative velocity
    velocity = 0;
  }
  if (Key.right) {
    rot -= 4 * delta;
    if (velocity > 0.5) {
      drift -= ACCEL * delta;
    }
  }
  if (Key.left) {
    rot += 4 * delta;
    if (velocity > 0.5) {
      drift += ACCEL * delta;
    }
  }
  if (drift) {
    drift += drift > 0 ? -DECEL * delta : DECEL * delta;
    if (Math.abs(drift) > MAXVEL) {
      drift = drift > MAXVEL ? MAXVEL : -MAXVEL;
    }
  }
  modelView = transform(modelView, { y: velocity, x: drift, rz: rot });
};

export let draw = (gl, projection, parentMatrix) => {
  gl.useProgram(program);

  gl.uniformMatrix4fv(modelMatrixPos, false, modelView);
  gl.uniformMatrix4fv(projectionMatrixPos, false, projection);
  gl.uniformMatrix4fv(parentMatrixPos, false, parentMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(vertexPos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPos);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
