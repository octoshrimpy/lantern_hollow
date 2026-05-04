import { SWEETIE16 } from './config.js';
import { generateWorld } from './worldgen.js';
import { bindControls } from './controls.js';
import { render } from './render.js';

const screen = document.getElementById('screen');
const swipePad = document.getElementById('swipePad');
const btnA = document.getElementById('btnA');
const btnB = document.getElementById('btnB');
const lastInputEl = document.getElementById('lastInput');
const seedInput = document.getElementById('seedInput');

Object.entries(SWEETIE16).forEach(([k, v]) => document.documentElement.style.setProperty(`--${k}`, v));

let state = generateWorld(seedInput.value || 'lantern-hollow');
let lastInput = 'ready';

function move(key) {
  const deltas = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
  const d = deltas[key];
  if (!d) return;
  state.player.x = Math.max(0, Math.min(state.width - 1, state.player.x + d[0]));
  state.player.y = Math.max(0, Math.min(state.height - 1, state.player.y + d[1]));
}

function onInput({ key, source }) {
  if (key.startsWith('Arrow')) move(key);
  lastInput = `${source}: ${key}`;
  lastInputEl.textContent = lastInput;
  render(screen, state, lastInput);
}

bindControls({ swipePad, btnA, btnB, onInput });
seedInput.addEventListener('change', () => {
  state = generateWorld(seedInput.value || 'lantern-hollow');
  render(screen, state, lastInput);
});

document.addEventListener('keydown', (event) => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter','Escape'].includes(event.key)) onInput({ key: event.key, source: 'keyboard' });
});

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
render(screen, state, lastInput);
