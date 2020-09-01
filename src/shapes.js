/**
 * Create vertex array for visible part of a cube
 * Contains 18 vertices(6 triangles)
 *
 * @param width {number}
 * @param height {number}
 */
export let partialCube = (width, height) => [
  // top face
  width, 0, 0, // top right
  0, 0, 0, // top left
  0, width, 0, // bottom left
  width, 0, 0, // top right
  0, width, 0, // bottom left
  width, width, 0, // bottom right

  // right face
  width, width, 0, // top right
  0, width, 0, // top left
  0, width, height, // bottom left
  width, width, 0, // top right
  0, width, height, // bottom left
  width, width, height, // bottom right

  // left face
  0, width, 0, // top right
  0, 0, 0, // top left
  0, 0, height, // bottom left
  0, width, 0, // top right
  0, 0, height, // bottom left
  0, width, height, // bottom right
];

export let partialCubeNormal = () => [
  // top face
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  // right face
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  // left face
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
];
