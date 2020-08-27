import { startLoop } from "./engine/loop.js";
import { gameLoop } from "./game.js";

let base = document.getElementById("ui");

let setElements = (arr) => {
  base.innerHTML = "";
  base.append(...arr);
};

// Define all UI elements here
// ------------------------------

// Title text
let title = document.createElement("div");
title.id = "t";
title.innerText = "A GAME";

// Main play button
let playButton = document.createElement("div");
playButton.id = "p";
playButton.innerText = "PLAY";
playButton.onclick = () => {
  base.style.visibility = "hidden";
  startLoop(gameLoop);
};

export let showUi = () => {
  setElements([title, playButton]);
};
