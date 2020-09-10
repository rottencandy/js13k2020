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

  levelsGrid.append(backButton);
  levelsGrid.append(
    ...levels.map((level, i) => {
      let ele = document.createElement("div");
      ele.id = "level";
      ele.innerText = i + 1;
      ele.onclick = () => {
        gameState.level = i + 1;
        fadeOut();
        loadLevel(level);
        setTimeout(startGame, TIMEOUT_INTERVAL, false);
      };
      return ele;
    })
  );

  wrapper.append(backButton, title, levelsGrid);
  setUIElement(wrapper);
};
