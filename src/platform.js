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
  platforms = [];

export let TILEGAP = 10,
  TILESIZE = 50,
  playerInitPos = [1, 1],
  gridWidth,
  gridHeight;

export let init = (gl) => {
  program = compile(gl, vshader, fshader);

  buffer = makeBuffer(gl, gl.ARRAY_BUFFER, [
    0,
    0, // top left
    0,
    TILESIZE, // bottom left
    TILESIZE,
    0, // top right
    TILESIZE,
    TILESIZE, // bottom right
  ]);

  vertexPos = gl.getAttribLocation(program, "aVertexPosition");
  modelMatrixPos = gl.getUniformLocation(program, "uModelViewMatrix");
  parentTransformPos = gl.getUniformLocation(program, "uParentTransform");
  projectionMatrixPos = gl.getUniformLocation(program, "uProjectionMatrix");
};

export let decodeLevel = (levelData) => {
  [gridWidth, gridHeight, tiles] = levelData.split(":");
  // Fastest array initialization https://stackoverflow.com/q/1295584/7683374
  (parsedTiles = []).length = gridWidth * gridHeight;
  // TODO Not required?
  parsedTiles.fill("0");
  // to keep track of parsed tiles index
  let curPos = 0;

  for (let i = 0; i < tiles.length; i++) {
    let val = tiles.charAt(i);

    if (Number(val)) {
      let count = Number(val);
      parsedTiles.fill(tiles.charAt(++i), curPos, curPos + count);
      curPos += count;
    } else {
      parsedTiles[curPos++] = val;
    }
  }

  (platforms = []).length = gridWidth * gridHeight;
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      platforms.push({
        type: parsedTiles[x + y * gridWidth],
        modelView: transform(identity(), {
          x: x * TILESIZE + TILEGAP * x,
          y: y * TILESIZE + TILEGAP * y,
        }),
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
  platforms.forEach((tile) => {
    gl.uniformMatrix4fv(modelMatrixPos, false, tile.modelView);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  });
};
