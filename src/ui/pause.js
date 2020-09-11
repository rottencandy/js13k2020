import { gameState } from "../game.js";
import * as Editor from "../editor.js";
import { changeBackdrop } from "../backdrop.js";
import {
  setUIElement,
  CENTERED_FADEIN,
  CENTERED_FADEOUT,
  textElement,
  buttonElement,
  create,
} from "./utils";
import { showMainMenu } from "./main";
import { enableTouchButton } from "./hud";

export let showPauseMenu = (onResume) => {
  let wrapper = create("div", "pausemenu");
  wrapper.className = CENTERED_FADEIN;
  let fadeOut = () => (wrapper.className = CENTERED_FADEOUT);

  let themeList = create("div", "dropdown");
  let themes = gameState.hasCoil
    ? ["default", "night", "retro"]
    : ["default", "night"];
  themeList.append(
    ...themes.map((val, i) => {
      let btn = buttonElement(val, "dropitem", () => changeBackdrop(i));
      return btn;
    })
  );

  let themeButton = create("div", "button", "BACKGROUND ▾");
  themeButton.className = "themebtn";
  themeButton.append(themeList);
  // hack to simulate a dropdown menu
  wrapper.onclick = (e) =>
    (themeList.style.visibility = e.target.matches(".themebtn")
      ? "visible"
      : "hidden");

  let title = textElement("PAUSED", "title");

  let resumeButton = buttonElement("RESUME", "button", () => {
    fadeOut();
    onResume();
  });

  let mainMenuButton = buttonElement("MAIN MENU", "button", () => {
    fadeOut();
    setTimeout(showMainMenu, 500);
  });

  wrapper.append(
    title,
    resumeButton,
    themeButton,
    enableTouchButton,
    mainMenuButton
  );
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
