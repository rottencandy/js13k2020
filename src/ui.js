import { startLoop } from "./engine/loop.js";
import { gameLoop, gameState, editorLoop, checkMonetization } from "./game";
import { loadLevel, pauseScene } from "./scene";
import { levels } from "./levels";
import * as Editor from "./editor.js";
import { keyCodes } from "./engine/input.js";

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
  checkMonetization();
};

// touch controls
let touchButton = (id, key, content = "") => {
  let ele = document.createElement("div");
  ele.id = id;
  ele.innerText = content;
  ele.onpointerdown = () => onkeydown({ keyCode: keyCodes[key] });
  ele.onpointerup = () => onkeyup({ keyCode: keyCodes[key] });
  return ele;
};
let b0 = touchButton("b0", "up");
let b1 = touchButton("b1", "right");
let b2 = touchButton("b2", "left");
let b3 = touchButton("b3", "down");
let b4 = touchButton("button", "space", "⮤⮧");
b4.className = "b4";
// Button to enable touch controls
let enableTouchButton = buttonElement("☐ TOUCH CONTROLS", "button", (e) => {
  if (gameState.touchControls) {
    gameState.touchControls = false;
    e.target.innerText = "☐ TOUCH CONTROLS";
  } else {
    gameState.touchControls = true;
    e.target.innerText = "☑ TOUCH CONTROLS";
  }
});

let hideUI = (isGame) => {
  base.style.visibility = HIDDEN;
  hud.style.visibility = VISIBLE;
  fadeOut = () => (hud.style.visibility = HIDDEN);
  let pauseButton = buttonElement("II", "pausebutton", () => {
    fadeOut();
    isGame ? pauseScene() : Editor.pauseEditor();
    // no need to run pause here because it's handled by startOrResumeGame
  });
  let editComplete = buttonElement("✓", "pausebutton", () => {
    fadeOut();
    Editor.pauseEditor();
    gameState.editedLevel = true;
  });
  let resetButton = buttonElement("↺", "pausebutton", () => Editor.reset());
  let upperHud = document.createElement("div");
  upperHud.id = "hudmenu";
  upperHud.append(pauseButton);
  isGame || upperHud.append(editComplete, resetButton);

  hud.innerHTML = "";
  hud.append(upperHud);
  if (gameState.touchControls) {
    let controls = document.createElement("div");
    controls.id = "controls";
    controls.append(b0, b1, b2, b3);
    isGame || controls.append(b4);
    hud.append(controls);
  }
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

  wrapper.append(title, startButton, customLevelsButton, enableTouchButton);
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
  // the pause menu is reused to show the level editor completed screen
  if (!isGame && gameState.editedLevel) {
    gameState.editedLevel = false;
    let title = textElement("LEVEL CREATED", "subtitle");
    let levelText = document.createElement("input");
    levelText.value = Editor.getEncodedLevel();
    levelText.readOnly = true;
    // give it some time to attach to DOM
    setTimeout(() => {
      levelText.focus();
      levelText.select();
    }, 10);
    wrapper.append(title, levelText, mainMenuButton);
  } else {
    wrapper.append(title, resumeButton, enableTouchButton, mainMenuButton);
  }
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
    let wrapper = document.createElement("div");
    wrapper.id = "mainmenu";
    wrapper.className = CENTERED_FADEIN;
    let fadeOut = () => (wrapper.className = CENTERED_FADEOUT);
    let title = textElement("ENTER LEVEL DATA", "subtitle");
    let levelText = document.createElement("input");
    let editorButton = buttonElement("START", "button", () => {
      loadLevel(levelText.value)
        ? (fadeOut(), setTimeout(startOrResumeGame, 500, true))
        : (levelText.className = "wrong");
    });
    wrapper.append(backButton, title, levelText, editorButton);
    setUIElement(wrapper);
  });
  let editorButton = buttonElement("CREATE LEVEL", "button", () => {
    fadeOut();
    Editor.reset();
    setTimeout(startOrResumeGame, 500, false);
  });
  wrapper.append(backButton, title, customLevelButton, editorButton);
  setUIElement(wrapper);
};
