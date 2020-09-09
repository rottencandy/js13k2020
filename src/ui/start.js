import { startLoop } from "../engine/loop";
import { editorLoop, gameLoop, gameState } from "../game";
import { base, HIDDEN } from "./utils";
import { showMainMenu } from "./main";
import { showEditCompleteMenu, showPauseMenu } from "./pause";
import { showHUD } from "./hud";

export let startGame = (isEditor) => {
  base.style.visibility = HIDDEN;
  showHUD(isEditor);

  startLoop(isEditor ? editorLoop : gameLoop, () => {
    if (!gameState.state) {
      // TODO: set level as completed, see if this is custom level
      showMainMenu();
    } else {
      // paused through esc button
      if (isEditor && gameState.editedLevel) {
        gameState.editedLevel = false;
        showEditCompleteMenu();
      } else {
        showPauseMenu(() => startGame(isEditor));
      }
    }
  });
};
