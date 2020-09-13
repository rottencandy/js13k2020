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
  create,
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
  // show special message if all levels completed
  if (gameState.level === 20) {
    let endMessage = create(
      "p",
      "",
      "You have completed all the levels. Now go create your own!"
    );
    let customLevelsButton = buttonElement("CUSTOM LEVELS", "button", () => {
      fadeOut();
      setTimeout(showCustomLevelsMenu, 500);
    });
    wrapper.append(title, endMessage, customLevelsButton, mainMenuButton);
  } else {
    wrapper.append(title, continueButton, mainMenuButton);
  }
  setUIElement(wrapper);
};

export let startGame = (isEditor) => {
  // set ui elements to null to hide scrollbar
  setUIElement();
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
