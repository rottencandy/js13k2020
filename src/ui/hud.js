import { keyCodes } from "../engine/input";
import { pauseScene } from "../scene";
import * as Editor from "../editor.js";
import { gameState } from "../game";
import {
  hud,
  HIDDEN,
  VISIBLE,
  EMPTY,
  buttonElement,
  textElement,
} from "./utils";

// Button to enable touch controls
export let enableTouchButton = buttonElement(
  "☐ TOUCH CONTROLS",
  "button",
  (e) => {
    if (gameState.touchControls) {
      gameState.touchControls = false;
      e.target.innerText = "☐ TOUCH CONTROLS";
    } else {
      gameState.touchControls = true;
      e.target.innerText = "☑ TOUCH CONTROLS";
    }
  }
);
// touch controls
let touchButton = (id, key, content = "") => {
  let ele = textElement(content, id);
  ele.onpointerdown = (e) => {
    onkeydown({ keyCode: keyCodes[key] });
    e.preventDefault();
  };
  ele.onpointerup = (e) => {
    onkeyup({ keyCode: keyCodes[key] });
    e.preventDefault();
  };
  return ele;
};

let button0 = touchButton("b0", "up");
let button1 = touchButton("b1", "right");
let button2 = touchButton("b2", "left");
let button3 = touchButton("b3", "down");
let button4 = touchButton("button", "space", "⮤⮧");
button4.className = "b4";

let touchControlButtons = (isEditor) => {
  let controls = document.createElement("div");
  controls.id = "controls";
  controls.append(button0, button1, button2, button3);
  isEditor && controls.append(button4);
  return controls;
};

export let showHUD = (isEditor) => {
  hud.style.visibility = VISIBLE;
  fadeOut = () => (hud.style.visibility = HIDDEN);

  let pauseButton = buttonElement("II", "pausebutton", () => {
    fadeOut();
    isEditor ? Editor.pauseEditor() : pauseScene();
    // no need to pause loop here because it's done by startGame
  });

  let upperHud = document.createElement("div");
  upperHud.id = "hudmenu";
  upperHud.append(pauseButton);

  if (isEditor) {
    let editComplete = buttonElement("✓", "pausebutton", () => {
      fadeOut();
      Editor.pauseEditor();
      gameState.editedLevel = true;
    });

    let resetButton = buttonElement("↺", "pausebutton", Editor.reset);

    upperHud.append(editComplete, resetButton);
  }

  hud.innerHTML = EMPTY;
  hud.append(upperHud);

  if (gameState.touchControls) {
    hud.append(touchControlButtons(isEditor));
  }
};
