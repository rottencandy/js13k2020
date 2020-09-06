import * as Backdrop from "./backdrop";
import { identity, transform, degToRad } from "./engine/math";
import { Key } from "./engine/input";
import * as Selector from "./selector";
import { createTileData, loadTileBuffer, drawTile } from "./tile";

let gridWidth = 1,
  parentTransform = identity(),
  platforms = [],
  tileData = [],
  // These two keep track of the number of negative(outside of grid) steps we've taken
  // So we could update tileData grid properly
  negativeX = 1,
  negativeY = 1;

export let reset = (width, height) => {
  state = 0;
  parentTransform = transform(identity(), {
    y: width / 2,
    x: height / 2,
    rx: -degToRad(30),
    rz: -Math.PI / 4,
  });
  Selector.reset();
  platforms = [["a"]];
  tileData = [[createTileData(0, 0, "a", true)]];
};

export let init = (gl) => {
  // no need to init tiles, already done in game.js
  Selector.init(gl);
};

let newPlatformRow = () => {
  let newRow = [];
  newRow.length = gridWidth + 1;
  newRow.fill("a");
  return newRow;
};
let newTileRowUp = () => {
  let newRow = [];
  for (i = 0; i < gridWidth + 1; i++) {
    newRow[i] = createTileData(i + 1 - negativeX, -negativeY, "a", true);
  }
  return newRow;
};
let newTileRowDown = () => {
  let newRow = [];
  for (i = 0; i < gridWidth + 1; i++) {
    newRow[i] = createTileData(
      i + 1 - negativeX,
      gridWidth + 1 - negativeY,
      "a",
      true
    );
  }
  return newRow;
};

export let update = () => {
  if (Key.esc) {
    return 2;
  }
  Selector.update();

  if (
    Selector.X < 0 ||
    Selector.Y < 0 ||
    Selector.X >= gridWidth ||
    Selector.Y >= gridWidth
  ) {
    if (Selector.X < 0) {
      platforms.map((_, i) => {
        platforms[i].unshift("a");
        tileData[i].unshift(
          createTileData(-negativeX, i + 1 - negativeY, "a", true)
        );
      });
      negativeX++;
      platforms.push(newPlatformRow());
      tileData.push(newTileRowDown());
      Selector.setContextPos(0, Selector.Y);
    }
    if (Selector.X >= gridWidth) {
      platforms.map((_, i) => {
        platforms[i].push("a");
        tileData[i].push(
          createTileData(
            gridWidth + 1 - negativeX,
            i + 1 - negativeY,
            "a",
            true
          )
        );
      });
      platforms.push(newPlatformRow());
      tileData.push(newTileRowDown());
      Selector.setContextPos(gridWidth, Selector.Y);
    }
    if (Selector.Y < 0) {
      platforms.map((_, i) => {
        platforms[i].push("a");
        tileData[i].push(
          createTileData(
            gridWidth + 1 - negativeX,
            i + 1 - negativeY,
            "a",
            true
          )
        );
      });
      platforms.unshift(newPlatformRow());
      tileData.unshift(newTileRowUp());
      Selector.setContextPos(Selector.X, 0);
      negativeY++;
    }
    if (Selector.Y >= gridWidth) {
      platforms.map((_, i) => {
        platforms[i].push("a");
        tileData[i].push(
          createTileData(
            gridWidth + 1 - negativeX,
            i + 1 - negativeY,
            "a",
            true
          )
        );
      });
      platforms.push(newPlatformRow());
      tileData.push(newTileRowDown());
      Selector.setContextPos(Selector.X, gridWidth);
    }

    // grid dimensions are now increased
    gridWidth++;
  }

  return 3;
};

export let draw = (gl) => {
  Selector.draw(gl, parentTransform);
  loadTileBuffer(gl, parentTransform);
  tileData.forEach((row) => row.forEach((tile) => drawTile(gl, tile)));

  Backdrop.draw(gl);
};
