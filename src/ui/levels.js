import { gameState } from "../game";
import { loadLevel } from "../scene";
import { levels } from "../levels";
import {
  CENTERED_FADEIN,
  CENTERED_FADEOUT,
  buttonElement,
  textElement,
  setUIElement,
  TIMEOUT_INTERVAL,
  getLevelsCompleted,
} from "./utils";
import { showMainMenu } from "./main";
import { startGame } from "./start";

export let showLevelsMenu = () => {
  let wrapper = document.createElement("div");
  wrapper.id = "mainmenu";
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = CENTERED_FADEOUT);

  let backButton = buttonElement("←", "backbutton", () => {
    fadeOut();
    setTimeout(showMainMenu, TIMEOUT_INTERVAL);
  });

  let title = textElement("SELECT LEVEL", "subtitle");

  let levelsGrid = document.createElement("div");
  levelsGrid.id = "levelsgrid";

  let completed = getLevelsCompleted();
  levelsGrid.append(backButton);
  levelsGrid.append(
    ...levels.map((level, i) => {
      let startFunc = () => {
        gameState.level = i + 1;
        fadeOut();
        loadLevel(level);
        setTimeout(startGame, TIMEOUT_INTERVAL, false);
      };
      let ele = buttonElement(
        i + 1,
        "level",
        i <= completed ? startFunc : () => {}
      );
      ele.className =
        i < completed ? "completed" : i > completed ? "blocked" : "active";
      return ele;
    })
  );

  wrapper.append(backButton, title, levelsGrid);
  setUIElement(wrapper);
};
