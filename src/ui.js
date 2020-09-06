import { startLoop } from "./engine/loop.js";
import { gameLoop, gameState, editorLoop, getCanvasSize } from "./game";
import { loadLevel } from "./scene";
import { levels } from "./levels";
import * as Editor from "./editor.js";

let base = document.getElementById("ui"),
  CENTERED_FADEIN = "centered fadein";

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
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = "centered zoomin");

  // Title text
  let title = textElement("A GAME", "title");

  // Main start button
  let startButton = buttonElement("START", "button", () => {
    fadeOut();
    setTimeout(showLevelsMenu, 500);
  });

  // Custom levels button
  let customLevelsButton = buttonElement("CUSTOM LEVELS", "button", () => {
    fadeOut();
    setTimeout(showCustomLevelsMenu, 500);
  });

  wrapper.append(title, startButton, customLevelsButton);
  setElements([wrapper]);
};
let startOrResume = () => {
  hideUI();
  startLoop(gameLoop, () => {
    if (!gameState.state) {
      showLevelsMenu();
    } else {
      showPauseMenu();
    }
  });
};

let showPauseMenu = () => {
  let wrapper = document.createElement("div");
  wrapper.id = "pausemenu";
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = "centered fadeout");

  let title = textElement("PAUSED", "title");
  let resumeButton = buttonElement("RESUME", "button", () => {
    fadeOut();
    setTimeout(startOrResume, 500);
  });
  let mainMenuButton = buttonElement("MAIN MENU", "button", () => {
    fadeOut();
    setTimeout(showMainMenu, 500);
  });
  wrapper.append(title, resumeButton, mainMenuButton);
  setElements([wrapper]);
};

let showLevelsMenu = () => {
  let wrapper = document.createElement("div");
  wrapper.id = "mainmenu";
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = "centered fadeout");

  let backButton = buttonElement("←", "backbutton", () => {
    fadeOut();
    setTimeout(showMainMenu, 600);
  });
  let title = textElement("CUSTOM LEVELS", "subtitle");

  let levelsGrid = document.createElement("div");
  levelsGrid.id = "levelsgrid";

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
        setTimeout(startOrResume, 500);
      };
      return ele;
    })
  );
  wrapper.append(backButton, title, levelsGrid);

  setElements([wrapper]);
};

let showCustomLevelsMenu = () => {
  let wrapper = document.createElement("div");
  wrapper.id = "mainmenu";
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = "centered fadeout");

  let title = textElement("CUSTOM LEVELS", "subtitle");

  let backButton = buttonElement("←", "backbutton", () => {
    fadeOut();
    setTimeout(showMainMenu, 600);
  });

  let customLevelButton = buttonElement("LOAD LEVEL", "button", () => {
    console.log("TODO");
  });
  let editorButton = buttonElement("CREATE LEVEL", "button", () => {
    fadeOut();
    gameState.level = 3;
    Editor.reset(...getCanvasSize());
    setTimeout(() => {
      hideUI();
      startLoop(editorLoop, () => {});
    }, 500);
  });
  wrapper.append(backButton, title, customLevelButton, editorButton);
  setElements([wrapper]);
};
