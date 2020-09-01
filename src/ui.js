import { startLoop } from "./engine/loop.js";
import { gameLoop, gameState, editorLoop } from "./game";
import { loadLevel } from "./scene";
import { levels } from "./levels";

let base = document.getElementById("ui");

let setElements = (arr) => {
  base.style.visibility = "visible";
  base.innerHTML = "";
  base.append(...arr);
};

let hideUI = () => (base.style.visibility = "hidden");

let textElement = (text) => {
  let ele = document.createElement("div");
  ele.id = "t";
  ele.innerText = text;
  return ele;
};

let buttonElement = (text, callback) => {
  let ele = document.createElement("div");
  ele.id = "b";
  ele.innerText = text;
  ele.onclick = callback;
  return ele;
};

// Title text
let title = textElement("A GAME");

let levelButtons = document.createElement("div");
levelButtons.id = "g";
levelButtons.append(
  ...levels.map((level, i) => {
    let ele = document.createElement("div");
    ele.id = "l";
    ele.innerText = i + 1;
    ele.onclick = () => {
      gameState.level = i;
      hideUI();
      loadLevel(level);
      startLoop(gameLoop, () =>
        gameState.state ? showWinMenu() : showLoseMenu()
      );
    };
    return ele;
  })
);

let levelEditorButton = buttonElement("CUSTOM LEVELS", () => {
  gameState.level = i;
  hideUI();
  startLoop(editorLoop, () => {});
});

// Main start button
let playButton = buttonElement("START", () => {
  showLevels();
});

// Success title text
let successText = textElement("COMPLETED");

// Fail title text
let failText = textElement("TRY AGAIN");

export let showMainMenu = () =>
  setElements([title, playButton, levelEditorButton]);

// Back button
let homeButton = buttonElement("MAIN MENU", showMainMenu);

let showLevels = () => setElements([levelButtons, homeButton]);

let showWinMenu = () => setElements([successText, homeButton]);

let showLoseMenu = () => setElements([failText, playButton, homeButton]);
