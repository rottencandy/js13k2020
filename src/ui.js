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

let textElement = (text, id) => {
  let ele = document.createElement("div");
  ele.id = id;
  ele.innerText = text;
  return ele;
};

let buttonElement = (text, id, callback) => {
  let ele = document.createElement("div");
  ele.id = id;
  ele.innerText = text;
  ele.onclick = callback;
  return ele;
};

export let showMainMenu = () => {
  let wrapper = document.createElement("div");
  wrapper.id = "mainmenu";
  wrapper.className = "centered fadein";

  // Title text
  let title = textElement("A GAME", "title");

  // Main start button
  let startButton = buttonElement("START", "button", () => {
    wrapper.className = "centered zoomin";
    setTimeout(showLevelsMenu, 500);
  });

  // Custom levels button
  let levelEditorButton = buttonElement("CUSTOM LEVELS", "button", () => {
    gameState.level = i;
    hideUI();
    startLoop(editorLoop, () => {});
  });

  wrapper.append(title, startButton, levelEditorButton);
  setElements([wrapper]);
};

let showLevelsMenu = () => {
  // Levels
  let levelsGrid = document.createElement("div");
  levelsGrid.id = "levelsgrid";
  levelsGrid.className = "centered fadein";
  let fadeout = () => (levelsGrid.className = "centered fadeout");

  let backButton = buttonElement("←", "backbutton", () => {
    fadeout();
    setTimeout(showMainMenu, 600);
  });
  levelsGrid.append(backButton);

  levelsGrid.append(
    ...levels.map((level, i) => {
      let ele = document.createElement("div");
      ele.id = "level";
      ele.innerText = i + 1;
      ele.onclick = () => {
        gameState.level = i;
        fadeout();
        loadLevel(level);
        setTimeout(() => {
          hideUI();
          startLoop(gameLoop, () => {});
        }, 500);
      };
      return ele;
    })
  );

  setElements([levelsGrid]);
};
