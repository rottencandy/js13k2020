import { checkMonetization } from "../game";

export let base = document.getElementById("ui"),
  hud = document.getElementById("hud"),
  // helpful constants
  CENTERED_FADEIN = "centered fadein",
  CENTERED_FADEOUT = "centered fadeout",
  VISIBLE = "visible",
  HIDDEN = "hidden",
  EMPTY = "",
  TIMEOUT_INTERVAL;

export let create = (type, id, text) => {
  let ele = document.createElement(type);
  ele.id = id;
  ele.innerText = text;
  return ele;
};

export let textElement = (text, id) => create("div", id, text);

export let buttonElement = (text, id, callback) => {
  let ele = textElement(text, id);
  ele.onclick = callback;
  return ele;
};

export let setUIElement = (ele) => {
  base.style.visibility = VISIBLE;
  hud.style.visibility = HIDDEN;
  base.innerHTML = EMPTY;
  base.append(ele);
  checkMonetization();
};
