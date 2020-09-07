import { startLoop } from "./engine/loop.js";
import { gameLoop, gameState, editorLoop, getCanvasSize } from "./game";
import { loadLevel, pauseScene } from "./scene";
import { levels } from "./levels";
import * as Editor from "./editor.js";

let base = document.getElementById("ui"),
  hud = document.getElementById("hud"),
  // helpful constants
  CENTERED_FADEIN = "centered fadein",
  CENTERED_FADEOUT = "centered fadeout",
  VISIBLE = "visible",
  HIDDEN = "hidden";

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

let setUIElement = (ele) => {
  base.style.visibility = VISIBLE;
  hud.style.visibility = HIDDEN;
  base.innerHTML = "";
  base.append(ele);
};

let hideUI = (isGame) => {
  base.style.visibility = HIDDEN;
  hud.style.visibility = VISIBLE;
  let pauseButton = buttonElement("II", "pausebutton", () => {
    hud.style.visibility = HIDDEN;
    isGame ? pauseScene() : Editor.pauseEditor();
    // paused through UI
    showPauseMenu(isGame);
  });
  hud.innerHTML = "";
  hud.append(pauseButton);
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
  setUIElement(wrapper);
};

let startOrResumeGame = (isGame) => {
  hideUI(isGame);
  startLoop(isGame ? gameLoop : editorLoop, () => {
    if (!gameState.state) {
      // TODO: set level as completed
      showMainMenu();
    } else {
      // paused through esc button
      showPauseMenu(isGame);
    }
  });
};

let showPauseMenu = (isGame) => {
  let wrapper = document.createElement("div");
  wrapper.id = "pausemenu";
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = CENTERED_FADEOUT);

  let title = textElement("PAUSED", "title");
  let resumeButton = buttonElement("RESUME", "button", () => {
    fadeOut();
    setTimeout(startOrResumeGame, 500, isGame);
  });
  let mainMenuButton = buttonElement("MAIN MENU", "button", () => {
    fadeOut();
    setTimeout(showMainMenu, 500);
  });
  wrapper.append(title, resumeButton, mainMenuButton);
  setUIElement(wrapper);
};

let showLevelsMenu = () => {
  let wrapper = document.createElement("div");
  wrapper.id = "mainmenu";
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = CENTERED_FADEOUT);

  let backButton = buttonElement("←", "backbutton", () => {
    fadeOut();
    setTimeout(showMainMenu, 600);
  });
  let title = textElement("SELECT LEVEL", "subtitle");

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
        fadeOut();
        loadLevel(level);
        setTimeout(startOrResumeGame, 500, true);
      };
      return ele;
    })
  );
  wrapper.append(backButton, title, levelsGrid);
  setUIElement(wrapper);
};

let showCustomLevelsMenu = () => {
  let wrapper = document.createElement("div");
  wrapper.id = "mainmenu";
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = CENTERED_FADEOUT);

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
    Editor.reset(...getCanvasSize());
    setTimeout(startOrResumeGame, 500, false);
  });
  wrapper.append(backButton, title, customLevelButton, editorButton);
  setUIElement(wrapper);
};
