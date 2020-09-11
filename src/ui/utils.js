import { checkMonetization } from "../game";
import { rgbToHex, denormalize, backdropBase } from "../palette";
import { buttonClickSound } from "../sound/sounds";

export let base = document.getElementById("ui"),
  hud = document.getElementById("hud"),
  // helpful constants
  CENTERED_FADEIN = "centered fadein",
  CENTERED_FADEOUT = "centered fadeout",
  VISIBLE = "visible",
  HIDDEN = "hidden",
  EMPTY = "",
  storateString = "js13k-20-fourfold",
  TIMEOUT_INTERVAL = 500;

export let create = (type, id, text) => {
  let ele = document.createElement(type);
  ele.id = id;
  ele.innerText = text || "";
  return ele;
};

export let textElement = (text, id) => create("div", id, text);

export let buttonElement = (text, id, callback) => {
  let ele = textElement(text, id);
  ele.onclick = (e) => {
    buttonClickSound();
    callback(e);
  };
  return ele;
};

export let setUIElement = (ele) => {
  base.style.visibility = VISIBLE;
  hud.style.visibility = HIDDEN;
  base.innerHTML = EMPTY;
  base.append(ele);
  checkMonetization();
  base.style.background = document.body.style.background = `radial-gradient(#576,${rgbToHex(
    denormalize(backdropBase)
  )})`;
};

export let getLevelsCompleted = () =>
  Number(localStorage.getItem(storateString)) || 0;

export let setLevelsCompleted = (level) =>
  localStorage.setItem(storateString, level);
