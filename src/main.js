import { initGame } from "./game.js";
import { showMainMenu } from "./ui/main.js";

let canvas = document.getElementById("app");

let WIDTH = 1280,
  HEIGHT = 720;

let aspect = WIDTH / HEIGHT;
canvas.width = WIDTH;
canvas.height = HEIGHT;

initGame(canvas, WIDTH, HEIGHT);

// Maintain aspect ratio
onresize = () => {
  canvas.height = Math.min(
    innerHeight,
    innerWidth < WIDTH ? Math.floor(innerWidth / aspect) : HEIGHT
  );
  canvas.width = Math.min(
    innerWidth,
    innerHeight < HEIGHT ? Math.floor(innerHeight * aspect) : WIDTH
  );
};
onresize();

showMainMenu();
