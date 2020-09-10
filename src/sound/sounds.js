import { zzfxG, zzfxP, zzfxM } from "./zzfx";

let buttonClick = zzfxG(...[, 0, , 0.05, , 0.5]);

let piano = [0.5, 0, 190, , 0.08, 0.5, 3];

let moveset = [
  [
    zzfxM(...[[piano], [[[, , 5, , , , ,]]], [0]]),
    zzfxM(...[[piano], [[[, , 6, , , , ,]]], [0]]),
    zzfxM(...[[piano], [[[, , 8, , , , ,]]], [0]]),
    zzfxM(...[[piano], [[[, , 17, , , , ,]]], [0]]),
  ],
  [
    zzfxM(...[[piano], [[[, , 3, , , , ,]]], [0]]),
    zzfxM(...[[piano], [[[, , 5, , , , ,]]], [0]]),
    zzfxM(...[[piano], [[[, , 6, , , , ,]]], [0]]),
    zzfxM(...[[piano], [[[, , 15, , , , ,]]], [0]]),
  ],
];
let activeSet = 0;

let completed = zzfxM(...[[piano], [[[, , 2, 3, 7, 20, , , , ,]]], [0]]);

export let buttonClickSound = () => {
  zzfxP(buttonClick);
};

export let moveSound = (jump) => {
  zzfxP(...moveset[activeSet][jump]);
  jump === 3 && (activeSet = Number(!activeSet));
};

export let finishedSound = () => {
  zzfxP(...completed);
};
