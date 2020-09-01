import * as Player from "./player";
import * as Tile from "./tile";
import { transform, identity, degToRad } from "./engine/math";

let gridWidth,
  parentTransform = identity(),
  state = 0;
export let platforms = [];

export let init = (gl) => {
  Tile.init(gl);
  Player.init(gl);
};

export let update = (delta) => {
  switch (state) {
    // Enter scene
    case 0:
      platforms.forEach((tile, i) => {
        Tile.setEnterPos(tile, i);
      });
      if (platforms[0].zpos === 0) state = 1;
      return 1;
    // Play scene
    case 1:
      Player.update(delta);

      return Tile.checkTile(
        platforms[Player.playerX + gridWidth * Player.playerY]
      );
  }
};

export let draw = (gl) => {
  Tile.loadTileBuffer(gl, parentTransform);
  platforms.forEach((tile) => Tile.drawTile(gl, tile));

  Player.load(gl, parentTransform);

  Player.draw(gl);
};

export let loadLevel = (levelData) => {
  [gridWidth, tiles] = levelData.split(":");
  state = 0;

  parentTransform = transform(identity(), {
    y: gridWidth * Tile.TILEWIDTH,
    rx: -degToRad(30),
    rz: -Math.PI / 4,
  });
  // Fastest array initialization https://stackoverflow.com/q/1295584/7683374
  (parsedTiles = []).length = gridWidth * 2;
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
  // Next, fill platform wih position & detail metadata for each tile
  (platforms = []).length = 0;
  for (let y = 0; y < gridWidth; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let type = parsedTiles[x + y * gridWidth];

      // TODO is this efficient? Only done once, so does it matter?
      type === "a" && Player.initPos(x, y, gridWidth);
      platforms.push(Tile.createTileData(x, y, type));
    }
  }
};
