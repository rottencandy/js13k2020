import {
  CENTERED_FADEIN,
  textElement,
  buttonElement,
  setUIElement,
} from "./utils";
import { showLevelsMenu } from "./levels";
import { showCustomLevelsMenu } from "./custom";
import { enableTouchButton } from "./hud";

export let showMainMenu = () => {
  let wrapper = document.createElement("div");
  wrapper.id = "mainmenu";
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = "centered zoomin");

  // Title text
  let title = textElement("FOURFOLD", "title");

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
