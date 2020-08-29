import { showMainMenu } from "./ui";
import { initGame } from "./game.js";

let canvas = document.getElementById("app");

let WIDTH = 800,
  HEIGHT = 600;

let aspect = WIDTH / HEIGHT;
canvas.width = WIDTH;
canvas.height = HEIGHT;

initGame(canvas);

// Maintain aspect ratio
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

showMainMenu();
