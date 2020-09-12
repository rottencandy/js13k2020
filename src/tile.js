import { compile, makeBuffer } from "./engine/gl";
import * as Camera from "./engine/camera";
import { identity, transform } from "./engine/math";
import { partialCube, partialCubeNormal } from "./shapes";
import { lightDirection, tileColor, backdropBase } from "./palette";
import { gameState } from "./game";

export let TILEGAP = 10,
  TILEWIDTH = 50,
  TILEHEIGHT = 900,
  STARTZPOS = 1000;

let program;

// Vertex shader
// TODO hardcoded tile height
let vshader = `attribute vec4 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uParentTransform;
uniform mat4 uProjectionMatrix;

varying vec3 vNormal;
varying float vDepth;

void main() {
  gl_Position = uProjectionMatrix * uParentTransform * uModelViewMatrix * aVertexPosition;
  vNormal = aNormal;
  vDepth = aVertexPosition.z/900.;
}`;

// Fragment shader
let fshader = `precision mediump float;
uniform vec3 uLightDir;
uniform vec3 uColor;
uniform vec3 uBackdrop;

varying vec3 vNormal;
varying float vDepth;

void main() {
  float light = dot(normalize(vNormal), uLightDir);
  gl_FragColor = mix(vec4(uColor,1.), vec4(uBackdrop, 1.), vDepth);
  gl_FragColor.xyz *= light;
}`;

export let init = (gl) => {
  program = compile(gl, vshader, fshader);

  vertexBuffer = makeBuffer(
    gl,
    gl.ARRAY_BUFFER,
    partialCube(TILEWIDTH, TILEHEIGHT)
  );
  normalBuffer = makeBuffer(gl, gl.ARRAY_BUFFER, partialCubeNormal());
};

export let createTileData = (x, y, type, startAtZero = false) => {
  switch (type) {
    case "a":
      return {
        type,
        zpos: STARTZPOS,
        modelView: identity(),
      };
    case "x":
    // gap
    case "a":
    // basic non-interactive tile
    case "b":
    // destination tile
    case "c":
      return {
        type,
        zpos: STARTZPOS,
        modelView: transform(identity(), {
          x: x * TILEWIDTH + TILEGAP * x,
          y: y * TILEWIDTH + TILEGAP * y,
          z: startAtZero ? 0 : STARTZPOS,
        }),
      };
    case "d":
      return {
        type,
        steps: 1,
        oSteps: 1,
        zpos: STARTZPOS,
        modelView: transform(identity(), {
          x: x * TILEWIDTH + TILEGAP * x,
          y: y * TILEWIDTH + TILEGAP * y,
          z: startAtZero ? 0 : STARTZPOS,
        }),
      };
    default:
      return null;
  }
};

export let getTilesList = () => {
  return gameState.hasCoil ? ["x", "a", "b", "c", "d"] : ["x", "a", "b", "c"];
};

export let setEnterPos = (tile, index) => {
  if (!tile || tile.zpos === 0) return;
  switch (tile.type) {
    // start tile, behaves similar to "b"
    case "x":
    // gap
    case "a":
    // basic non-interactive tile
    case "b":
    // destination tile
    case "c":
    // one step tile
    case "d":
      // cleanup if tile moved too far away, else move it up gradually
      let displace = tile.zpos < 0 ? -tile.zpos : -7 - (index + 1);
      transform(tile.modelView, { z: displace });
      tile.zpos += displace;
  }
};

export let checkTile = (tile) => {
  // treat null as empty gap
  if (!tile) {
    return 2;
  }
  switch (tile.type) {
    // Win
    case "c":
      return 1;
    // Fall
    case "a":
      return 2;
    case "d":
      // stepping, fall down next
      if (tile.steps) {
        tile.steps--;
      } else if (tile.zpos > 0) {
        return 2;
      }
    // Continue
    default:
      return 0;
  }
};

export let updateState = (tile, isPlayerOn) => {
  if (!tile) {
    return;
  }
  if (tile.type === "d") {
    // available steps of tile exhausted, fall
    if (!isPlayerOn && !tile.steps) {
      tile.zpos += 20;
      transform(tile.modelView, { z: 20 });
      // reached the end. can ignore tile from now
      if (tile.zpos >= STARTZPOS) {
        tile.type = "a";
      }
    }
  }
};

export let resetState = (tile) => {
  if (!tile) {
    return;
  }
  // this is a step tile
  if (tile.oSteps) {
    tile.type = "d";
    tile.steps = tile.oSteps;
    transform(tile.modelView, { z: -tile.zpos });
    tile.zpos = 0;
  }
};

export let loadTileBuffer = (gl, parentTransform) => {
  program.use();

  vertexBuffer.bind(3, program.attribs.vertex);
  normalBuffer.bind(3, program.attribs.normal);

  gl.uniformMatrix4fv(program.uniforms.parentTransform, false, parentTransform);
  gl.uniformMatrix4fv(
    program.uniforms.projectionMatrix,
    false,
    Camera.projectionMatrix
  );
  gl.uniform3fv(program.uniforms.lightDir, lightDirection);
  gl.uniform3fv(program.uniforms.backdrop, backdropBase);
};

export let drawTile = (gl, tile) => {
  if (!tile || tile.type === "a") {
    return;
  }
  gl.uniform3fv(program.uniforms.color, tileColor[tile.type]);
  gl.uniformMatrix4fv(program.uniforms.modelMatrix, false, tile.modelView);
  gl.drawArrays(gl.TRIANGLES, 0, 18);
};
