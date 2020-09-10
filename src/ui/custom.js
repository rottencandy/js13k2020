import { loadLevel } from "../scene";
import * as Editor from "../editor.js";
import {
  CENTERED_FADEIN,
  CENTERED_FADEOUT,
  textElement,
  buttonElement,
  TIMEOUT_INTERVAL,
  setUIElement,
} from "./utils";
import { showMainMenu } from "./main";
import { startGame } from "./start";
import { gameState } from "../game";

let showLevelInput = () => {
  let wrapper = document.createElement("div");
  wrapper.id = "mainmenu";
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = CENTERED_FADEOUT);

  let backButton = buttonElement("←", "backbutton", () => {
    fadeOut();
    setTimeout(showCustomLevelsMenu, TIMEOUT_INTERVAL);
  });

  let title = textElement("ENTER LEVEL DATA", "subtitle");

  let levelText = document.createElement("input");

  let startButton = buttonElement("START", "button", () => {
    if (loadLevel(levelText.value)) {
      fadeOut();
      gameState.level = 0;
      setTimeout(startGame, TIMEOUT_INTERVAL, false);
    } else {
      levelText.className = "wrong";
    }
  });

  wrapper.append(backButton, title, levelText, startButton);
  setUIElement(wrapper);
};

export let showCustomLevelsMenu = () => {
  let wrapper = document.createElement("div");
  wrapper.id = "mainmenu";
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = CENTERED_FADEOUT);

  let title = textElement("CUSTOM LEVELS", "subtitle");

  let backButton = buttonElement("←", "backbutton", () => {
    fadeOut();
    setTimeout(showMainMenu, TIMEOUT_INTERVAL);
  });

  let customLevelButton = buttonElement("LOAD LEVEL", "button", () => {
    fadeOut();
    setTimeout(showLevelInput, TIMEOUT_INTERVAL);
  });
  let editorButton = buttonElement("CREATE LEVEL", "button", () => {
    fadeOut();
    Editor.reset();
    setTimeout(startGame, TIMEOUT_INTERVAL, true);
  });
  wrapper.append(backButton, title, customLevelButton, editorButton);
  setUIElement(wrapper);
};
