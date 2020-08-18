/**
 * Start the game loop
 *
 * @param {(delta: number) => void} step update function
 */
export let startLoop = (step) => {
  let last = 0;
  let loop = function(now) {
    let dt = now - last;
    last = now;
    // Sanity check - absorb random lag spike / frame jumps
    // (expected delta is 1000/60 = ~16.67ms)
    if(dt > 500) {
      dt = 500;
    }
    step(dt / 1000);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
};
