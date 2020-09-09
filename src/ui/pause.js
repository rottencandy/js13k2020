import * as Editor from "../editor.js";
import {
  setUIElement,
  CENTERED_FADEIN,
  CENTERED_FADEOUT,
  textElement,
  buttonElement,
} from "./utils";
import { showMainMenu } from "./main";
import { enableTouchButton } from "./hud";

export let showPauseMenu = (onResume) => {
  let wrapper = document.createElement("div");
  wrapper.id = "pausemenu";
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = CENTERED_FADEOUT);

  let title = textElement("PAUSED", "title");

  let resumeButton = buttonElement("RESUME", "button", () => {
    fadeOut();
    onResume();
  });

  let mainMenuButton = buttonElement("MAIN MENU", "button", () => {
    fadeOut();
    setTimeout(showMainMenu, 500);
  });

  wrapper.append(title, resumeButton, enableTouchButton, mainMenuButton);
  setUIElement(wrapper);
};

export let showEditCompleteMenu = () => {
  let wrapper = document.createElement("div");
  wrapper.id = "pausemenu";
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = CENTERED_FADEOUT);

  let title = textElement("LEVEL CREATED", "subtitle");

  let levelText = document.createElement("input");
  levelText.value = Editor.getEncodedLevel();
  levelText.readOnly = true;

  let mainMenuButton = buttonElement("MAIN MENU", "button", () => {
    fadeOut();
    setTimeout(showMainMenu, 500);
  });

  // give it some time to attach to DOM
  setTimeout(() => {
    levelText.focus();
    levelText.select();
  }, 50);

  wrapper.append(title, levelText, mainMenuButton);
  setUIElement(wrapper);
};
