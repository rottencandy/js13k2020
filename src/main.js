import { startLoop } from "./engine/loop.js";
import * as game from "./game.js";

let canvas = document.getElementById("app");

game.init(canvas);

startLoop((delta) => {
  game.update(delta);
  game.draw();
});
