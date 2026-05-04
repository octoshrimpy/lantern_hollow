import { WORLDGEN, GLYPHS } from './config.js';
import { hash32, xs32 } from './rng.js';

export function generateWorld(seedText = 'lantern-hollow') {
  const r = xs32(hash32(seedText));
  const { width, height, smoothPasses, waterThreshold, forestThreshold, hillThreshold } = WORLDGEN;

  let noise = Array.from({ length: height }, () => Array.from({ length: width }, () => r()));
  for (let i = 0; i < smoothPasses; i++) noise = smooth(noise, width, height);

  let min = Infinity;
  let max = -Infinity;
  for (const row of noise) for (const v of row) { if (v < min) min = v; if (v > max) max = v; }
  const scale = max > min ? 1 / (max - min) : 1;

  const map = noise.map((row) => row.map((v) => {
    const n = (v - min) * scale;
    if (n < waterThreshold) return GLYPHS.water;
    if (n > hillThreshold) return GLYPHS.hill;
    if (n > forestThreshold) return GLYPHS.trees;
    return GLYPHS.grass;
  }));

  const center = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
  map[center.y][center.x] = GLYPHS.town;
  return { map, width, height, player: { ...center }, seedText };
}

function smooth(grid, width, height) {
  return grid.map((row, y) => row.map((_, x) => {
    let sum = 0;
    let count = 0;
    for (let yy = y - 1; yy <= y + 1; yy++) {
      for (let xx = x - 1; xx <= x + 1; xx++) {
        if (yy < 0 || xx < 0 || yy >= height || xx >= width) continue;
        sum += grid[yy][xx];
        count += 1;
      }
    }
    return count > 0 ? sum / count : grid[y][x];
  }));
}
