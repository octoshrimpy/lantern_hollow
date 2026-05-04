const screen = document.getElementById('screen');
const swipePad = document.getElementById('swipePad');
const btnA = document.getElementById('btnA');
const btnB = document.getElementById('btnB');
const lastInput = document.getElementById('lastInput');

const HOLD_MS = 180;
const SWIPE_THRESHOLD = 18;

let startX = 0;
let startY = 0;
let activeDir = null;
let holdTimer = null;
let pointerActive = false;

function showInput(label) {
  lastInput.textContent = label;
  screen.textContent = `Input: ${label}`;
}

function emitKey(key) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true });
  document.dispatchEvent(event);
}

function directionFromDelta(dx, dy) {
  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return null;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'ArrowRight' : 'ArrowLeft';
  return dy > 0 ? 'ArrowDown' : 'ArrowUp';
}

function startHold(dir) {
  stopHold();
  activeDir = dir;
  holdTimer = window.setInterval(() => {
    emitKey(dir);
    showInput(dir + ' (hold)');
  }, HOLD_MS);
}

function stopHold() {
  if (holdTimer) {
    clearInterval(holdTimer);
    holdTimer = null;
  }
  activeDir = null;
}

swipePad.addEventListener('pointerdown', (event) => {
  pointerActive = true;
  startX = event.clientX;
  startY = event.clientY;
  swipePad.setPointerCapture(event.pointerId);
});

swipePad.addEventListener('pointermove', (event) => {
  if (!pointerActive) return;
  const dx = event.clientX - startX;
  const dy = event.clientY - startY;
  const dir = directionFromDelta(dx, dy);
  if (!dir) return;

  if (activeDir !== dir) {
    emitKey(dir);
    showInput(dir);
    startHold(dir);
  }
});

function endPointer() {
  pointerActive = false;
  stopHold();
}

swipePad.addEventListener('pointerup', endPointer);
swipePad.addEventListener('pointercancel', endPointer);

function pressButton(btn, key, label) {
  btn.classList.add('active');
  emitKey(key);
  showInput(label);
}

function releaseButton(btn) {
  btn.classList.remove('active');
}

btnA.addEventListener('pointerdown', () => pressButton(btnA, 'Enter', 'A / Enter'));
btnA.addEventListener('pointerup', () => releaseButton(btnA));
btnA.addEventListener('pointercancel', () => releaseButton(btnA));

btnB.addEventListener('pointerdown', () => pressButton(btnB, 'Escape', 'B / Escape'));
btnB.addEventListener('pointerup', () => releaseButton(btnB));
btnB.addEventListener('pointercancel', () => releaseButton(btnB));

document.addEventListener('keydown', (event) => {
  const mapped = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'];
  if (mapped.includes(event.key)) {
    showInput(`keyboard: ${event.key}`);
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch {
      // no-op
    }
  });
}

showInput('ready');
