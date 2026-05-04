import { GLYPHS } from './config.js';

export function render(screen, state, lastInput) {
  const lines = state.map.map((row, y) => row.map((tile, x) => {
    if (x === state.player.x && y === state.player.y) return GLYPHS.player;
    return tile;
  }).join(''));

  screen.textContent = [
    `Seed: ${state.seedText}`,
    `Input: ${lastInput}`,
    '',
    ...lines
  ].join('\n');
}
