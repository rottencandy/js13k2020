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
      let ele = buttonElement(
        i + 1,
        i + 1 === completed ? "completelevel" : "level",
        () => {
          gameState.level = i + 1;
          fadeOut();
          loadLevel(level);
          setTimeout(startGame, TIMEOUT_INTERVAL, false);
          // for when grid is scrolled to bottom
          window.scrollTo(0, 0);
        }
      );
      return ele;
    })
  );

  wrapper.append(backButton, title, levelsGrid);
  setUIElement(wrapper);
};
