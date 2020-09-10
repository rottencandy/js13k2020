import { compile, makeBuffer } from "./engine/gl";
import { backdropBase } from "./palette";

let vertexBuffer, program;

let vshader = `attribute vec2 aVertexPosition;
varying vec2 vST;

void main() {
  gl_Position = vec4(aVertexPosition.xy, .9, 1.);
  vST = (aVertexPosition+1.)/2.;
}`;

// hash function from https://www.shadertoy.com/view/4djSRW
// given a value between 0 and 1
// returns a value between 0 and 1 that *appears* kind of random
let hashFunc = `
float hash(float p) {
  vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
  p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
  return fract(p2.x * p2.y * 95.4337);
}`;

let fshader =
  `precision mediump float;
varying vec2 vST;
uniform float uTime;
uniform vec3 uColor;

float circle(vec2 p, float r) {
  return distance(vST,p)-r;
}
` +
  hashFunc +
  // Don't want shader comments inside build, so I'll just keep them here
  //
  // light: glowing light at top right
  // mnt1, mnt2: layers of mountains, made by simple sine waves, slightly shifted
  // in position, dividing them by 3 & 2 determines lightness
  // back: adding all layers of effects, and mixing with supplied color uniform
  `
void main() {
  float light = 1.-circle(vec2(.8,.9),.1);
  float mnt1 = step(vST.y, abs( sin(vST.x * 8. + uTime) ) / 4. + .3) / 3.;
  float mnt2 = step(vST.y, abs( sin(vST.x * 6. - uTime) ) / 4. + .1) / 2.;
  vec3 back = mix(vec3(light+max(mnt1,mnt2)), uColor, .7);
  gl_FragColor = vec4(vec3(back), 1.0);
}`;

export let init = (gl) => {
  program = compile(gl, vshader, fshader);
  vertexBuffer = makeBuffer(gl, gl.ARRAY_BUFFER, [-1, 1, -1, -1, 1, 1, 1, -1]);
};

export let draw = (gl, time) => {
  program.use();

  vertexBuffer.bind(2, program.attribs.vertex);
  gl.uniform3fv(program.uniforms.color, backdropBase);
  gl.uniform1f(program.uniforms.time, time / 10000);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
