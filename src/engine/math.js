// Source for all matrix-related functions: https://github.com/xem/webgl-guide/blob/gh-pages/lib/matrix.js
export let round = (num) => {
  return (num + 0.5) << 0;
};

export let floor = (num) => {
  return num << 0;
};

/**
 * Create projection matrix
 *
 * @param {Float32Array} out Target 4x4 Matrix
 * @param {number} fov Field of View
 * @param {number} aspect aspect ratio
 * @param {number} near near clip point
 * @param {number} far far clip point
 */
export let perspective = (out, fov, aspect, near, far) => {
  let f = 1.0 / Math.tan(fov / 2),
    nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }
  return out;
};

/**
 * Get the inverse of a mat4
 * The mat4 is not modified, a new mat4 is returned
 *
 * @param {Float32Array} m 4x4 Matrix
 */
export let inverse = (m) => {
  var inv = new Float32Array([
    m[5] * m[10] * m[15] -
      m[5] * m[11] * m[14] -
      m[9] * m[6] * m[15] +
      m[9] * m[7] * m[14] +
      m[13] * m[6] * m[11] -
      m[13] * m[7] * m[10],
    -m[1] * m[10] * m[15] +
      m[1] * m[11] * m[14] +
      m[9] * m[2] * m[15] -
      m[9] * m[3] * m[14] -
      m[13] * m[2] * m[11] +
      m[13] * m[3] * m[10],
    m[1] * m[6] * m[15] -
      m[1] * m[7] * m[14] -
      m[5] * m[2] * m[15] +
      m[5] * m[3] * m[14] +
      m[13] * m[2] * m[7] -
      m[13] * m[3] * m[6],
    -m[1] * m[6] * m[11] +
      m[1] * m[7] * m[10] +
      m[5] * m[2] * m[11] -
      m[5] * m[3] * m[10] -
      m[9] * m[2] * m[7] +
      m[9] * m[3] * m[6],
    -m[4] * m[10] * m[15] +
      m[4] * m[11] * m[14] +
      m[8] * m[6] * m[15] -
      m[8] * m[7] * m[14] -
      m[12] * m[6] * m[11] +
      m[12] * m[7] * m[10],
    m[0] * m[10] * m[15] -
      m[0] * m[11] * m[14] -
      m[8] * m[2] * m[15] +
      m[8] * m[3] * m[14] +
      m[12] * m[2] * m[11] -
      m[12] * m[3] * m[10],
    -m[0] * m[6] * m[15] +
      m[0] * m[7] * m[14] +
      m[4] * m[2] * m[15] -
      m[4] * m[3] * m[14] -
      m[12] * m[2] * m[7] +
      m[12] * m[3] * m[6],
    m[0] * m[6] * m[11] -
      m[0] * m[7] * m[10] -
      m[4] * m[2] * m[11] +
      m[4] * m[3] * m[10] +
      m[8] * m[2] * m[7] -
      m[8] * m[3] * m[6],
    m[4] * m[9] * m[15] -
      m[4] * m[11] * m[13] -
      m[8] * m[5] * m[15] +
      m[8] * m[7] * m[13] +
      m[12] * m[5] * m[11] -
      m[12] * m[7] * m[9],
    -m[0] * m[9] * m[15] +
      m[0] * m[11] * m[13] +
      m[8] * m[1] * m[15] -
      m[8] * m[3] * m[13] -
      m[12] * m[1] * m[11] +
      m[12] * m[3] * m[9],
    m[0] * m[5] * m[15] -
      m[0] * m[7] * m[13] -
      m[4] * m[1] * m[15] +
      m[4] * m[3] * m[13] +
      m[12] * m[1] * m[7] -
      m[12] * m[3] * m[5],
    -m[0] * m[5] * m[11] +
      m[0] * m[7] * m[9] +
      m[4] * m[1] * m[11] -
      m[4] * m[3] * m[9] -
      m[8] * m[1] * m[7] +
      m[8] * m[3] * m[5],
    -m[4] * m[9] * m[14] +
      m[4] * m[10] * m[13] +
      m[8] * m[5] * m[14] -
      m[8] * m[6] * m[13] -
      m[12] * m[5] * m[10] +
      m[12] * m[6] * m[9],
    m[0] * m[9] * m[14] -
      m[0] * m[10] * m[13] -
      m[8] * m[1] * m[14] +
      m[8] * m[2] * m[13] +
      m[12] * m[1] * m[10] -
      m[12] * m[2] * m[9],
    -m[0] * m[5] * m[14] +
      m[0] * m[6] * m[13] +
      m[4] * m[1] * m[14] -
      m[4] * m[2] * m[13] -
      m[12] * m[1] * m[6] +
      m[12] * m[2] * m[5],
    m[0] * m[5] * m[10] -
      m[0] * m[6] * m[9] -
      m[4] * m[1] * m[10] +
      m[4] * m[2] * m[9] +
      m[8] * m[1] * m[6] -
      m[8] * m[2] * m[5],
  ]);
  det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
  if (!det) return m;
  det = 1 / det;
  for (var i = 0; i < 16; i++) {
    inv[i] *= det;
  }
  return inv;
};

/**
 * Transpose a matrix
 *
 * @param {Float32Array} m 4x4 Matrix
 */
export let transpose = (m) => {
  return new Float32Array([
    m[0],
    m[4],
    m[8],
    m[12],
    m[1],
    m[5],
    m[9],
    m[13],
    m[2],
    m[6],
    m[10],
    m[14],
    m[3],
    m[7],
    m[11],
    m[15],
  ]);
};

/**
 * Returns a 4x4 identity matrix
 */
export let identity = () =>
  new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

/**
 * Compute the multiplication of two mat4 (c = a x b)
 *
 * @param {Float32Array} a 4x4 Matrix
 * @param {Float32Array} b 4x4 Matrix
 */
export let multiplyMat4 = (a, b) => {
  let i, ai0, ai1, ai2, ai3;
  let c = new Float32Array(16);
  for (i = 0; i < 4; i++) {
    ai0 = a[i];
    ai1 = a[i + 4];
    ai2 = a[i + 8];
    ai3 = a[i + 12];
    c[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
    c[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
    c[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
    c[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
  }
  return c;
};

/**
 * Transform a mat4
 * options: x/y/z (translate), rx/ry/rz (rotate), sx/sy/sz (scale)
 *
 * @param {Float32Array} mat 4x4 Matrix
 * @param {{x?: number, y?: number, z?: number, rx?: number, ry?: number, rz?: number, sx?: number, sy?: number, sz?: number}} options x/y/z-translate, rx/ry/rz-rotate sx/sy/sz-scale
 */
export let transform = (mat, options) => {
  let out = new Float32Array(mat);
  let x = options.x || 0,
    y = options.y || 0,
    z = options.z || 0;
  let sx = options.sx || 1,
    sy = options.sy || 1,
    sz = options.sz || 1;
  let rx = options.rx,
    ry = options.ry,
    rz = options.rz;

  // translate
  if (x || y || z) {
    out[12] += out[0] * x + out[4] * y + out[8] * z;
    out[13] += out[1] * x + out[5] * y + out[9] * z;
    out[14] += out[2] * x + out[6] * y + out[10] * z;
    out[15] += out[3] * x + out[7] * y + out[11] * z;
  }

  // Rotate
  if (rx) {
    out.set(
      multiplyMat4(
        out,
        new Float32Array([
          1,
          0,
          0,
          0,
          0,
          Math.cos(rx),
          Math.sin(rx),
          0,
          0,
          -Math.sin(rx),
          Math.cos(rx),
          0,
          0,
          0,
          0,
          1,
        ])
      )
    );
  }
  if (ry) {
    out.set(
      multiplyMat4(
        out,
        new Float32Array([
          Math.cos(ry),
          0,
          -Math.sin(ry),
          0,
          0,
          1,
          0,
          0,
          Math.sin(ry),
          0,
          Math.cos(ry),
          0,
          0,
          0,
          0,
          1,
        ])
      )
    );
  }
  if (rz) {
    out.set(
      multiplyMat4(
        out,
        new Float32Array([
          Math.cos(rz),
          Math.sin(rz),
          0,
          0,
          -Math.sin(rz),
          Math.cos(rz),
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
        ])
      )
    );
  }

  // Scale
  if (sx !== 1) {
    (out[0] *= sx), (out[1] *= sx), (out[2] *= sx), (out[3] *= sx);
  }
  if (sy !== 1) {
    (out[4] *= sy), (out[5] *= sy), (out[6] *= sy), (out[7] *= sy);
  }
  if (sz !== 1) {
    (out[8] *= sz), (out[9] *= sz), (out[10] *= sz), (out[11] *= sz);
  }

  return out;
};

/**
 * Place a camera at the position [cameraX, cameraY, cameraZ], make it look at the point [targetX, targetY, targetZ].
 * Optional: a "up" vector can be defined to tilt the camera on one side (vertical by default).
 *
 * @param {Float32Array} mat 4x4 Matrix
 * @param {number} cameraX Camera position x
 * @param {number} cameraY Camera position y
 * @param {number} cameraZ Camera position z
 * @param {number} targetX Look at position x
 * @param {number} targetY Look at position y
 * @param {number} targetZ Look at position z
 * @param {number} upX Tilt camera in x
 * @param {number} upY Tilt camera in y
 * @param {number} upZ Tilt camera in z
 */
export let lookAt = (
  mat,
  cameraX,
  cameraY,
  cameraZ,
  targetX,
  targetY,
  targetZ,
  upX = 0,
  upY = 1,
  upZ = 0
) => {
  var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;
  fx = targetX - cameraX;
  fy = targetY - cameraY;
  fz = targetZ - cameraZ;
  rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
  fx *= rlf;
  fy *= rlf;
  fz *= rlf;
  sx = fy * upZ - fz * upY;
  sy = fz * upX - fx * upZ;
  sz = fx * upY - fy * upX;
  rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
  sx *= rls;
  sy *= rls;
  sz *= rls;
  ux = sy * fz - sz * fy;
  uy = sz * fx - sx * fz;
  uz = sx * fy - sy * fx;
  var l = new Float32Array([
    sx,
    ux,
    -fx,
    0,
    sy,
    uy,
    -fy,
    0,
    sz,
    uz,
    -fz,
    0,
    0,
    0,
    0,
    1,
  ]);
  l = transform(l, { x: -cameraX, y: -cameraY, z: -cameraZ });
  return multiplyMat4(mat, l);
};
