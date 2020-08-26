let base = document.getElementById("ui");

let title = document.createElement("div");
title.id = "t";
title.innerText = "Its a GAMEE";

let playButton = document.createElement("button");
playButton.id = "p";
playButton.innerText = "Play!";

export let showUi = (onPlayCallback) => {
  playButton.onclick = () => {
    base.style.visibility = "hidden";
    onPlayCallback();
  };

  base.append(title, playButton);
};
