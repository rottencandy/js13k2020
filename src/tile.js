import { compile, makeBuffer } from "./engine/gl";
import * as Camera from "./engine/camera";
import { identity, transform } from "./engine/math";
import { partialCube, partialCubeNormal } from "./shapes";
import { lightDirection } from "./palette";

export let TILEGAP = 10,
  TILEWIDTH = 50,
  TILEHEIGHT = 600,
  STARTZPOS = 1000;

let program;

// Vertex shader
// TODO: light direction(normal) is hardcoded for now
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
  vDepth = aVertexPosition.z/500.0;
}`;

// Fragment shader
// TODO: lazily calculated fog, will look ugly when backdrop changes
let fshader = `precision mediump float;
uniform vec3 uLightDir;

varying vec3 vNormal;
varying float vDepth;

void main() {
  float light = dot(normalize(vNormal), uLightDir);
  gl_FragColor = mix(vec4(1.0, 0.0, 0.0, 1.0), vec4(0.8, 0.8, 0.8, 1.0), vDepth);
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

export let createTileData = (x, y, type) => {
  return {
    type,
    zpos: STARTZPOS,
    modelView: transform(identity(), {
      x: x * TILEWIDTH + TILEGAP * x,
      y: y * TILEWIDTH + TILEGAP * y,
      z: STARTZPOS,
    }),
  };
};

export let setEnterPos = (tile, index) => {
  if (tile.zpos === 0) return;
  switch (tile.type) {
    case "a":
    case "x":
    case "c":
    case "b":
      // cleanup if tile moved too far away, else move it up normally
      let displace = tile.zpos < 0 ? -tile.zpos : -7 - (index + 1) * 5;
      transform(tile.modelView, { z: displace });
      tile.zpos += displace;
  }
};

export let checkTile = (tile) => {
  switch (tile.type) {
    // Win
    case "b":
      return 1;
    // Fall
    case "c":
      return 2;
    // Continue
    default:
      return 0;
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
};

export let drawTile = (gl, tile) => {
  if (tile.type === "c") {
    return;
  }
  gl.uniformMatrix4fv(program.uniforms.modelMatrix, false, tile.modelView);
  gl.drawArrays(gl.TRIANGLES, 0, 18);
};
