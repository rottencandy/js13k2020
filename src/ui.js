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
  ele.className = "fadein";
  ele.innerText = text;
  return ele;
};

let buttonElement = (text, callback) => {
  let ele = document.createElement("div");
  ele.id = "button";
  ele.className = "fadein";
  ele.innerText = text;
  ele.onclick = callback;
  return ele;
};

export let showMainMenu = () => {
  let wrapper = document.createElement("div");
  let exitZoom = () => {
    wrapper.className += " zoomin";
  };

  // Title text
  let title = textElement("A GAME", "title");

  // Main start button
  let startButton = buttonElement("START", () => {
    exitZoom();
    setTimeout(showLevelsMenu, 500);
  });

  // Custom levels button
  let levelEditorButton = buttonElement("CUSTOM LEVELS", () => {
    gameState.level = i;
    hideUI();
    startLoop(editorLoop, () => {});
  });

  wrapper.id = "mainmenu";
  wrapper.className = "centered";
  wrapper.append(title, startButton, levelEditorButton);
  setElements([wrapper]);
};

let backButton = buttonElement("<", () => {});

let showLevelsMenu = () => {
  // Levels
  let levelsGrid = document.createElement("div");
  levelsGrid.id = "levelsgrid";
  levelsGrid.className = "centered fadein";
  levelsGrid.append(
    ...levels.map((level, i) => {
      let ele = document.createElement("div");
      ele.id = "level";
      ele.innerText = i + 1;
      ele.onclick = () => {
        gameState.level = i;
        levelsGrid.className += " fadeout";
        loadLevel(level);
        setTimeout(() => {
          hideUI();
          startLoop(gameLoop, () => {});
        }, 500);
      };
      return ele;
    })
  );

  setElements([backButton, levelsGrid]);
};
