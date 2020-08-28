import { compile, makeBuffer } from "./engine/gl";
import * as Camera from "./engine/camera";
import * as Player from "./player";
import { createTileData, TILESIZE, drawTile } from "./tile";

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
  parentTransformPos,
  buffer,
  vertexPos,
  platforms = [];

let gridWidth, gridHeight;

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

  Player.init(gl);
};

export let loadLevel = (levelData) => {
  [gridWidth, gridHeight, tiles] = levelData.split(":");
  // Array for temporary storage of decoded string
  // Fastest array initialization https://stackoverflow.com/q/1295584/7683374
  (parsedTiles = []).length = gridWidth * gridHeight;
  // TODO Not required?
  parsedTiles.fill("0");

  // First, create array of decoded tile chars
  for (let i = 0, curPos = 0; i < tiles.length; i++) {
    let val = tiles.charAt(i);

    if (Number(val)) {
      let count = Number(val);
      parsedTiles.fill(tiles.charAt(++i), curPos, curPos + count);
      curPos += count;
    } else {
      parsedTiles[curPos++] = val;
    }
  }

  // Next, add position & detail metadata for each tile
  (platforms = []).length = 0;
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let type = parsedTiles[x + y * gridWidth];

      // TODO is this efficient? Only done once, so does it matter?
      type === "a" && Player.initPos(x, y, gridWidth, gridHeight);
      platforms.push(createTileData(x, y, type));
    }
  }
};

export let update = (delta) => {
  Player.update(delta);
};

export let draw = (gl, parentTransform) => {
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(vertexPos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPos);
  gl.uniformMatrix4fv(parentTransformPos, false, parentTransform);
  gl.uniformMatrix4fv(projectionMatrixPos, false, Camera.projectionMatrix);

  platforms.forEach((tile) => drawTile(gl, tile, modelMatrixPos));

  Player.load(gl, parentTransform);

  Player.draw(gl);
};
