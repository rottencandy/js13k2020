import { zzfxG, zzfxP } from "./zzfx";

let buttonClick = zzfxG(...[, 0, , 0.05, , 0.5]);

export let buttonClickSound = () => {
  zzfxP(buttonClick);
};
