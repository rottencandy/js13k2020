import { startLoop } from "../engine/loop";
import { editorLoop, gameLoop, gameState } from "../game";
import { finishedSound } from "../sound/sounds";
import {
  base,
  HIDDEN,
  CENTERED_FADEIN,
  CENTERED_FADEOUT,
  buttonElement,
  textElement,
  setUIElement,
  setLevelsCompleted,
  getLevelsCompleted,
} from "./utils";
import { showMainMenu } from "./main";
import { showEditCompleteMenu, showPauseMenu } from "./pause";
import { showHUD } from "./hud";
import { showCustomLevelsMenu } from "./custom";
import { showLevelsMenu } from "./levels";

let levelCompleted = (isCustom) => {
  let wrapper = document.createElement("div");
  wrapper.id = "pausemenu";
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = CENTERED_FADEOUT);

  let title = textElement("COMPLETED!", "subtitle");

  let continueButton = buttonElement("CONTINUE", "button", () => {
    fadeOut();
    setTimeout(isCustom ? showCustomLevelsMenu : showLevelsMenu, 500);
  });

  let mainMenuButton = buttonElement("MAIN MENU", "button", () => {
    fadeOut();
    setTimeout(showMainMenu, 500);
  });

  finishedSound();
  isCustom ||
    (getLevelsCompleted() < gameState.level &&
      setLevelsCompleted(gameState.level));
  wrapper.append(title, continueButton, mainMenuButton);
  setUIElement(wrapper);
};

export let startGame = (isEditor) => {
  base.style.visibility = HIDDEN;
  showHUD(isEditor);

  startLoop(isEditor ? editorLoop : gameLoop, () => {
    if (!gameState.state) {
      // TODO: splash screen for level completion
      levelCompleted(gameState.level < 1);
    } else {
      // paused through esc button
      if (isEditor && gameState.editedLevel) {
        gameState.editedLevel = false;
        showEditCompleteMenu();
      } else {
        showPauseMenu(() => startGame(isEditor));
      }
    }
  });
};
