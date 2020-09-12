import * as Backdrop from "./backdrop";
import { identity, transform, degToRad } from "./engine/math";
import { Key } from "./engine/input";
import * as Camera from "./engine/camera";
import * as Selector from "./selector";
import { createTileData, loadTileBuffer, drawTile, getTilesList } from "./tile";

let gridWidth = 1,
  state = 0,
  parentTransform = identity(),
  platforms = [],
  tileData = [],
  sceneWidth,
  sceneHeight,
  pauseNextIteration = false,
  // These two keep track of the number of negative(outside of grid) steps we've taken
  // So we could update tileData grid properly
  // parts of code using these are very delicate and subtle!
  negativeX = 1,
  negativeY = 1;

export let reset = () => {
  state = 0;
  Camera.update(sceneWidth, sceneHeight);
  parentTransform = transform(identity(), {
    x: sceneWidth / 3,
    y: (sceneHeight * 2) / 3,
    rx: -degToRad(30),
    rz: -0.5,
  });
  negativeX = negativeY = gridWidth = 1;
  Selector.reset();
  platforms = [["x"]];
  tileData = [[createTileData(0, 0, "x", true)]];
};

export let init = (gl, width, height) => {
  sceneWidth = width;
  sceneHeight = height;
  // no need to init tiles, already done in game.js
  Selector.init(gl);
};

// used to pause through UI
export let pauseEditor = () => (pauseNextIteration = true);

export let getEncodedLevel = () => {
  let encodedRows = [];
  for (let y = 0; y < gridWidth; y++) {
    let row = platforms[y],
      current = row[0],
      fullRow = "",
      count = 0;
    for (let x = 1; x <= gridWidth; x++) {
      let val = row[x];
      if (val !== current) {
        fullRow += count < 1 ? current : count + 1 + current;
        current = val;
        count = 0;
      } else {
        // TODO: current level parser does not recognize double digits,
        // so kept them small for now
        if (count === 8) {
          fullRow += count + 1 + current;
          current = val;
          count = 0;
        } else {
          count++;
        }
      }
    }
    encodedRows.push(fullRow);
  }
  // Uncommented because this need to affect gridWidth value
  // TODO: this still doesn't trim empty columns
  // trim empty rows from bottom
  //let rowLength = encodedRows.length - 1;
  //while (encodedRows[rowLength--] === gridWidth + "a") {
  //  encodedRows.pop();
  //}

  // trim empty rows from top
  rowLength = 0;
  while (encodedRows[rowLength++] === gridWidth + "a") {
    encodedRows.shift();
  }
  // trim empty rows from bottom
  rowLength = gridWidth - 1;
  while (encodedRows[rowLength--] === gridWidth + "a") {
    encodedRows.pop();
  }
  return gridWidth + ":" + encodedRows.reduce((acc, val) => acc + val, "");
};

export let update = () => {
  if (Key.esc || pauseNextIteration) {
    pauseNextIteration = false;
    return 2;
  }
  if (Key.mouse.down) {
    Camera.move(Key.mouse.x, Key.mouse.y);
    Key.mouse.x = Key.mouse.y = 0;
  }
  switch (state) {
    case 0:
      Selector.update();

      // The hairy bit
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
      // cycle tile type if space pressed and move to temp state
      if (Key.space) {
        let curTile = platforms[Selector.Y][Selector.X];
        let nextTile = getNextTile(curTile);
        platforms[Selector.Y][Selector.X] = nextTile;
        tileData[Selector.Y][Selector.X] = createTileData(
          Selector.X + 1 - negativeX,
          Selector.Y + 1 - negativeY,
          nextTile,
          true
        );
        state = 1;
      }
      break;
    // temporary state to wait untill keys are unpressed
    case 1:
      if (!Key.space) {
        state = 0;
      }
  }
  return 3;
};

export let draw = (gl, time) => {
  Selector.draw(gl, parentTransform);
  loadTileBuffer(gl, parentTransform);
  tileData.forEach((row) => row.forEach((tile) => drawTile(gl, tile)));

  Backdrop.draw(gl, time);
};

let getNextTile = (curTile) => {
  let tiles = getTilesList();
  let pos = tiles.indexOf(curTile);
  return pos === tiles.length - 1 ? tiles[0] : tiles[pos + 1];
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
