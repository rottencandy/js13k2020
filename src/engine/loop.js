/**
 * Start the game loop
 * Return any falsey value to terminate.
 *
 * @param {(delta: number) => void} step update function
 */
export let startLoop = (step, onEnd) => {
  let last = 0;
  let loop = function (now) {
    let dt = now - last;
    last = now;
    // Sanity check - absorb random lag spike / frame jumps
    // (expected delta is 1000/60 = ~16.67ms)
    if (dt > 500) {
      dt = 500;
    }
    // Stop on falsey return and run callback
    step(dt / 1000, now) ? requestAnimationFrame(loop) : onEnd();
  };
  requestAnimationFrame(loop);
};
