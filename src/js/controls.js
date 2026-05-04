export function bindControls({ swipePad, btnA, btnB, onInput }) {
  const HOLD_MS = 180;
  const THRESHOLD = 18;
  let startX = 0;
  let startY = 0;
  let active = null;
  let timer = null;
  let moving = false;

  const emit = (key, source) => onInput({ key, source });
  const stopHold = () => {
    if (timer) clearInterval(timer);
    timer = null;
    active = null;
  };

  const endGesture = () => {
    stopHold();
    moving = false;
  };

  const dirFrom = (dx, dy) => {
    if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return null;
    return Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft')
      : (dy > 0 ? 'ArrowDown' : 'ArrowUp');
  };

  swipePad.addEventListener('pointerdown', (e) => {
    moving = true;
    startX = e.clientX;
    startY = e.clientY;
    swipePad.setPointerCapture(e.pointerId);
  });

  swipePad.addEventListener('pointermove', (e) => {
    if (!moving) return;
    const dir = dirFrom(e.clientX - startX, e.clientY - startY);
    if (!dir || dir === active) return;

    active = dir;
    emit(dir, 'swipe');
    if (timer) clearInterval(timer);
    timer = setInterval(() => emit(dir, 'swipe-hold'), HOLD_MS);
  });

  swipePad.addEventListener('pointerup', endGesture);
  swipePad.addEventListener('pointercancel', endGesture);

  const bindButton = (button, key, label) => {
    button.addEventListener('pointerdown', () => {
      button.classList.add('active');
      emit(key, label);
    });
    button.addEventListener('pointerup', () => button.classList.remove('active'));
    button.addEventListener('pointercancel', () => button.classList.remove('active'));
  };

  bindButton(btnA, 'Enter', 'A');
  bindButton(btnB, 'Escape', 'B');
}
