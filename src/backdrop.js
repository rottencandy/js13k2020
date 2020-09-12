import { compile, makeBuffer } from "./engine/gl";
import { setBackdropColor } from "./palette";

let vertexBuffer, program1, program2, program3, program4, activeProgram;

let vshader = `attribute vec2 aVertexPosition;
varying vec2 vST;

void main() {
  gl_Position = vec4(aVertexPosition.xy, .9, 1.);
  vST = (aVertexPosition+1.)/2.;
}`;

let fsImports = `precision mediump float;
varying vec2 vST;
uniform float uTime;`;

// hash function from https://www.shadertoy.com/view/4djSRW
// given a value between 0 and 1
// returns a value between 0 and 1 that *appears* kind of random
let hashFunc = `
float hash(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float newrand(vec2 p, float num) {
  return fract(hash(p) * num);
}`;

let circleSDF = `
float circle(vec2 p, float r) {
  return distance(vST,p)-r;
}`;

let scale = `
  mat2 scale(vec2 _s) {
  return mat2(_s.x,0.,0.,_s.y);
}`;

let rotate = `
  mat2 rot(float r) {
  return mat2(cos(r), -sin(r), sin(r), cos(r));
}`;

// Don't want shader comments inside build, so I'll just put them here
//
// light: glowing light at top right
// mnt1, mnt2: layers of mountains, made by simple sine waves, slightly shifted,
// dividing them by 3 & 2 determines lightness shade
// back: adding all layers of effects, and mixing with supplied color uniform
let fshader1 =
  fsImports +
  circleSDF +
  hashFunc +
  `
void main() {
  vec3 col = vec3(.58,.64,.75);
  float light = 1.-circle(vec2(.8,.9),.1);
  float mnt1 = step(vST.y, abs( sin(vST.x * 8. + uTime) ) / 4. + .3) / 3.;
  float mnt2 = step(vST.y, abs( cos(vST.x * 6. - uTime) ) / 4. + .1) / 2.;
  vec3 back = mix(vec3(light+max(mnt1,mnt2)), col, .7);
  gl_FragColor = vec4(vec3(back), 1.0);
}`;

// starfield shader
// uv: fraction grid coordinate
// id: unique value of each 'container'
// stars: x, y is halved out after taking random, to avoid border clipping
// (can probably be solved with neighbour iteration)
let fshader2 =
  fsImports +
  hashFunc +
  scale +
  rotate +
  `
float star(vec2 p, float r) {
  return smoothstep(.01, 1., r/length(p));
}
vec3 layer(vec2 u) {
  vec2 grid = fract(u) - .5;
  vec2 id = floor(u) / 8.;
  float size = newrand(id, 1.)/40.; 
  float stars = star(grid + vec2((newrand(id, 10.)-.5)/2., (newrand(id, 20.)-.5)/2.), size);
  vec3 col = sin(vec3(newrand(id, 35.),newrand(id, 66.),newrand(id,93.))*2.+uTime) / 2. + .5;
  col *= vec3(.8,.7,.9);
  col += .5;
  return stars * col;
}
void main() {
  vec3 col = vec3(0.);
  for(float i=0.; i<1.; i+=.2) {
    float depth = fract(uTime/16. + i);
    float scale = mix(20., .5, depth);
    col += layer(vST * rot(uTime/8.) * scale + i*32.) * depth;
  }
  gl_FragColor = vec4(col, 1.0);
}`;

// st: translated(and bent?) vertex
// lines: drawing grid using step()
// grid: b/w map of drawn lines
// fade: top half
// light: top right circle
let fshader3 =
  fsImports +
  scale +
  rotate +
  `
void main() {
  vec3 col = vec3(0.8, .06, .9);
  vec3 sun = vec3(.3, .13, .2);
  vec2 st = vST * scale(vec2(vST.y + .5, -vST.y*2.)) - vec2(-uTime/8., uTime/8.);
  st += vec2(.5,.0);
  st *= rot(.01);
  vec2 lines = step(vec2(.05), fract(st*16.));
  float grid = 1.-(lines.x*lines.y);
  float faded = min(grid, 0.6-vST.y);
  float light = .2/length(vST - vec2(.95));
  vec3 final = mix(vec3(faded), col, .3);
  final = mix(final, sun, mix(vec3(light), vec3(1.,0.,0.),vST.y));
  gl_FragColor = vec4(final, 1.0);
}`;

let fshader4 =
  fsImports +
  hashFunc +
  scale +
  rotate +
  `
void main() {
  float y = vST.y * 8.;
  float x = vST.x * 8. + uTime;
  float curve = y + vST.x - sin(x)/2. + sin(uTime);
  float lines = step(.01, fract(curve));
  vec2 id = vec2(floor(curve));
  vec3 col = vec3(newrand(id, 83.), newrand(id, 23.), newrand(id, 65.));
  col = mix(col, vec3(curve, .9-vST.x, vST.y), .4);
  gl_FragColor = vec4(vec3(lines-col), 1.0);
}`;

export let init = (gl) => {
  program1 = compile(gl, vshader, fshader1);
  program2 = compile(gl, vshader, fshader2);
  program3 = compile(gl, vshader, fshader3);
  program4 = compile(gl, vshader, fshader4);
  activeProgram = program1;
  vertexBuffer = makeBuffer(gl, gl.ARRAY_BUFFER, [-1, 1, -1, -1, 1, 1, 1, -1]);
};

export let changeBackdrop = (opt) => {
  switch (opt) {
    case 0:
      setBackdropColor([0.58, 0.64, 0.75]);
      activeProgram = program1;
      break;
    case 1:
      setBackdropColor([0, 0, 0]);
      activeProgram = program2;
      break;
    case 2:
      setBackdropColor([1, 0.16, 1]);
      activeProgram = program3;
      break;
    case 3:
      setBackdropColor([1, 1, 1]);
      activeProgram = program4;
      break;
  }
};

export let draw = (gl, time) => {
  activeProgram.use();

  vertexBuffer.bind(2, activeProgram.attribs.vertex);
  gl.uniform1f(activeProgram.uniforms.time, time / 10000);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
