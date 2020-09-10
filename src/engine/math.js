export let floor = Math.floor;
export let radToDeg = r => r * 180 / Math.PI;
export let degToRad = d => d * Math.PI / 180;

export let cross = (a, b) => new Float32Array(
    [a[1] * b[2] - a[2] * b[1],
     a[2] * b[0] - a[0] * b[2],
     a[0] * b[1] - a[1] * b[0]]);

export let subtractVectors = (a, b) => new Float32Array([a[0] - b[0], a[1] - b[1], a[2] - b[2]]);

export let normalize = (v) => {
  let length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
};

/**
 * Returns a 4x4 identity matrix
 */
export let identity = () => {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
};

// Note: This matrix flips the Y axis so that 0 is at the top.
export let orthographic = (left, right, bottom, top, near, far) => new Float32Array([
  2 / (right - left), 0, 0, 0,
  0, 2 / (top - bottom), 0, 0,
  0, 0, 2 / (near - far), 0,

  (left + right) / (left - right),
  (bottom + top) / (bottom - top),
  (near + far) / (near - far),
  1,
]);

// Create a perspective matrix
export let perspective = (FOVInRadians, aspect, near, far) => {
  let f = Math.tan(Math.PI * 0.5 - 0.5 * FOVInRadians);
  let rangeInv = 1.0 / (near - far);

  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ]);
};

export let camLookAt = (cameraPosition, target, up) => {
  let zAxis = normalize(
      subtractVectors(cameraPosition, target));
  let xAxis = normalize(cross(up, zAxis));
  let yAxis = normalize(cross(zAxis, xAxis));

  return [
     xAxis[0], xAxis[1], xAxis[2], 0,
     yAxis[0], yAxis[1], yAxis[2], 0,
     zAxis[0], zAxis[1], zAxis[2], 0,
     cameraPosition[0],
     cameraPosition[1],
     cameraPosition[2],
     1,
  ];
}

/**
 * Compute the multiplication of two mat4 (c = a x b)
 *
 * @param {Float32Array} a 4x4 Matrix
 * @param {Float32Array} b 4x4 Matrix
 */
export let multMat4Mat4 = (a, b) => {
  let i, ai0, ai1, ai2, ai3;
  for (i = 0; i < 4; i++) {
    ai0 = a[i];
    ai1 = a[i+4];
    ai2 = a[i+8];
    ai3 = a[i+12];
    a[i]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
    a[i+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
    a[i+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
    a[i+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
  }
  return a;
};

/**
 * Transform a mat4
 * options: x/y/z (translate), rx/ry/rz (rotate), sx/sy/sz (scale)
 *
 * @param {Float32Array} mat 4x4 Matrix
 * @param {{x?: number, y?: number, z?: number, rx?: number, ry?: number, rz?: number, sx?: number, sy?: number, sz?: number}} options x/y/z-translate, rx/ry/rz-rotate sx/sy/sz-scale
 */
export let transform = (mat, options) => {
  
  let x = options.x || 0;
  let y = options.y || 0;
  let z = options.z || 0;
  
  let sx = options.sx || 1;
  let sy = options.sy || 1;
  let sz = options.sz || 1;
  
  let rx = options.rx;
  let ry = options.ry;
  let rz = options.rz;
  
  // translate
  if(x || y || z){
    mat[12] += mat[0] * x + mat[4] * y + mat[8]  * z;
    mat[13] += mat[1] * x + mat[5] * y + mat[9]  * z;
    mat[14] += mat[2] * x + mat[6] * y + mat[10] * z;
    mat[15] += mat[3] * x + mat[7] * y + mat[11] * z;
  }
  
  // Rotate
  if(rx) multMat4Mat4(mat, new Float32Array([1, 0, 0, 0, 0, Math.cos(rx), Math.sin(rx), 0, 0, -Math.sin(rx), Math.cos(rx), 0, 0, 0, 0, 1]));
  if(ry) multMat4Mat4(mat, new Float32Array([Math.cos(ry), 0, -Math.sin(ry), 0, 0, 1, 0, 0, Math.sin(ry), 0, Math.cos(ry), 0, 0, 0, 0, 1]));
  if(rz) multMat4Mat4(mat, new Float32Array([Math.cos(rz), Math.sin(rz), 0, 0, -Math.sin(rz), Math.cos(rz), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
  
  // Scale
  if(sx !== 1){
    mat[0] *= sx;  
    mat[1] *= sx;
    mat[2] *= sx;
    mat[3] *= sx;
  }
  if(sy !== 1){
    mat[4] *= sy;
    mat[5] *= sy;
    mat[6] *= sy;
    mat[7] *= sy;
  }
  if(sz !== 1){
    mat[8] *= sz;
    mat[9] *= sz;
    mat[10] *= sz;
    mat[11] *= sz;
  }
  
  return mat;
};


// Create a matrix representing a rotation around an arbitrary axis [x, y, z]
export let rotate = (axis, angle) => {

  let x = axis[0], y = axis[1], z = axis[2];
  let len = Math.hypot(x, y, z);
  let s, c, t;
  
  if (len == 0) return null;

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(angle);
  c = Math.cos(angle);
  t = 1 - c;

  return new Float32Array([
    x * x * t + c,      y * x * t + z * s,  z * x * t - y * s,   0,
    x * y * t - z * s,  y * y * t + c,      z * y * t + x * s,   0,
    x * z * t + y * s,  y * z * t - x * s,  z * z * t + c,       0,
    0, 0, 0, 1
  ]);
};

// Apply a matrix transformation to a custom axis
export let transformMat4 = (a, m) => {
  let x = a[0],
    y = a[1],
    z = a[2];
  let w = (m[3] * x + m[7] * y + m[11] * z + m[15])|| 1.0;
  
  return new Float32Array([
    (m[0] * x + m[4] * y + m[8] * z + m[12]) / w,
    (m[1] * x + m[5] * y + m[9] * z + m[13]) / w,
    (m[2] * x + m[6] * y + m[10] * z + m[14]) / w
  ]);
}

/**
 * Transpose a matrix
 *
 * @param {Float32Array} m 4x4 Matrix
 */
export let transpose = m => {
  return new Float32Array([
    m[0], m[4], m[8],  m[12],
    m[1], m[5], m[9],  m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15]
  ]);
};

/**
 * Get the inverse of a mat4
 * The mat4 is not modified, a new mat4 is returned
 *
 * @param {Float32Array} m 4x4 Matrix
 */
export let inverseTranspose = m => transpose(inverse(m));

// 
// Optional: a "up" vector can be defined to tilt the camera on one side (vertical by default).  
/**
 * Place a camera at the position [cameraX, cameraY, cameraZ], make it look at the point [targetX, targetY, targetZ].
 * Optional: a "up" vector can be defined to tilt the camera on one side (vertical by default).
 *
 * @param {Float32Array} mat 4x4 Matrix
 * @param {number} cameraX Camera position x
 * @param {number} cameraY Camera position y
 * @param {number} cameraZ Camera position z
 * @param {number} targetX Look at x
 * @param {number} targetY Look at y
 * @param {number} targetZ Look at z
 * @param {number} upX Tilt camera in x-axis
 * @param {number} upY Tilt camera in y-axis
 * @param {number} upZ Tilt camera in z-axis
 */
export let lookMatrix = (mat, cameraX, cameraY, cameraZ, targetX, targetY, targetZ, upX = 0, upY = 1, upZ = 0) => {
  let fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;
  fx = targetX - cameraX;
  fy = targetY - cameraY;
  fz = targetZ - cameraZ;
  rlf = 1 / Math.sqrt(fx*fx + fy*fy + fz*fz);
  fx *= rlf;
  fy *= rlf;
  fz *= rlf;
  sx = fy * upZ - fz * upY;
  sy = fz * upX - fx * upZ;
  sz = fx * upY - fy * upX;
  rls = 1 / Math.sqrt(sx*sx + sy*sy + sz*sz);
  sx *= rls;
  sy *= rls;
  sz *= rls;
  ux = sy * fz - sz * fy;
  uy = sz * fx - sx * fz;
  uz = sx * fy - sy * fx;
  let l = new Float32Array([
    sx, ux, -fx, 0,
    sy, uy, -fy, 0,
    sz, uz, -fz, 0,
    0,  0,  0,   1
  ]);
  transform(l, {x: -cameraX, y: -cameraY, z: -cameraZ});
  return multMat4Mat4(mat, l); 
}
/**
 * Create projection matrix
 *
 * @param {Float32Array} out Target 4x4 Matrix
 * @param {number} fov Field of View
 * @param {number} aspect aspect ratio
 * @param {number} near near clip point
 * @param {number} far far clip point
 */
