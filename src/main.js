import { startLoop } from "./engine/loop.js";
import * as game from "./game.js";

let canvas = document.getElementById("app");

let WIDTH = 800,
  HEIGHT = 600;

let aspect = WIDTH / HEIGHT;
canvas.width = WIDTH;
canvas.height = HEIGHT;

game.init(canvas);

onresize = () => {
  canvas.height = Math.min(
    innerHeight,
    innerWidth < WIDTH ? Math.floor((innerWidth * 1) / aspect) : HEIGHT
  );
  canvas.width = Math.min(
    innerWidth,
    innerHeight < HEIGHT ? Math.floor(innerHeight * 1 * aspect) : WIDTH
  );
};
onresize();

startLoop((delta) => {
  game.update(delta);
  game.draw();
});
