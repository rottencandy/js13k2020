import { compile, makeBuffer } from "./engine/gl";
import * as Camera from "./engine/camera";
import { identity, transform } from "./engine/math";
import { partialCube, partialCubeNormal } from "./shapes";

export let TILEGAP = 10,
  TILEWIDTH = 50,
  TILEHEIGHT = 100,
  STARTZPOS = 1000;

let program;

// Vertex shader
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
  vDepth = 1.0-aVertexPosition.z/100.0;
}`;

// Fragment shader
// light direction is hardcoded for now
let fshader = `precision mediump float;
varying vec3 vNormal;
varying float vDepth;

void main() {
  float light = dot(normalize(vNormal), vec3(-0.5, 0.8, -1.0));
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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
  // Lose
  if (tile.type === "c") {
    return 0;
  }
  // Win
  if (tile.type === "b") {
    return 2;
  }
  // Continue
  return 1;
};

export let loadTileBuffer = (gl, parentTransform) => {
  program.use();

  vertexBuffer.bind();
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
};

export let drawTile = (gl, tile) => {
  if (tile.type === "c") {
    return;
  }
  gl.uniformMatrix4fv(program.uniforms.modelMatrix, false, tile.modelView);
  gl.drawArrays(gl.TRIANGLES, 0, 18);
};
