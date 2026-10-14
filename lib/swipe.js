// Turns a touch gesture into a day step: swipe left = +1 (next day), right = -1, otherwise 0.
// Mostly-vertical gestures are scrolling, not swipes.
export function swipeStep(dx, dy, min = 60) {
  if (Math.abs(dx) < min || Math.abs(dx) < 2 * Math.abs(dy)) return 0;
  return dx < 0 ? 1 : -1;
}
