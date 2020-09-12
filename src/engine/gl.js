/**
 * Compile shaders into program
 *
 * @param {string} vshader vertex shader
 * @param {string} fshader fragment shader
 */
export let compile = (gl, vshader, fshader) => {
  let vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vshader);
  gl.compileShader(vs);

  let fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fshader);
  gl.compileShader(fs);

  let program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  // TODO: only for testing, disable before release
  //console.log("vertex shader:", gl.getShaderInfoLog(vs) || "OK");
  //console.log("fragment shader:", gl.getShaderInfoLog(fs) || "OK");
  //console.log("program:", gl.getProgramInfoLog(program) || "OK");

  return {
    program,
    use: () => gl.useProgram(program),
    attribs: {
      vertex: gl.getAttribLocation(program, "aVertexPosition"),
      normal: gl.getAttribLocation(program, "aNormal"),
    },
    uniforms: {
      modelMatrix: gl.getUniformLocation(program, "uModelViewMatrix"),
      parentTransform: gl.getUniformLocation(program, "uParentTransform"),
      projectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix"),
      lightDir: gl.getUniformLocation(program, "uLightDir"),
      jump: gl.getUniformLocation(program, "uJump"),
      color: gl.getUniformLocation(program, "uColor"),
      color2: gl.getUniformLocation(program, "uColor2"),
      backdrop: gl.getUniformLocation(program, "uBackdrop"),
      time: gl.getUniformLocation(program, "uTime"),
    },
  };
};

/**
 * Create a buffer
 *
 * @param gl WebGL context
 * @param type buffer type
 * @param data buffer data
 */
export let makeBuffer = (gl, type, data) => {
  let buffer = gl.createBuffer();
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, new Float32Array(data), gl.STATIC_DRAW);
  return {
    bind: (size, pointer) => {
      gl.bindBuffer(type, buffer);
      gl.vertexAttribPointer(pointer, size, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(pointer);
    },
  };
};
