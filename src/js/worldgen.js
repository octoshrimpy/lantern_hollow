import { WORLDGEN, GLYPHS } from './config.js';
import { hash32, xs32 } from './rng.js';

export function generateWorld(seedText = 'lantern-hollow') {
  const r = xs32(hash32(seedText));
  const { width, height, fillPercent, smoothPasses, waterThreshold, forestThreshold, hillThreshold } = WORLDGEN;

  let noise = Array.from({ length: height }, () => Array.from({ length: width }, () => (r() < fillPercent ? 1 : 0)));
  for (let i = 0; i < smoothPasses; i++) noise = smooth(noise, width, height);

  const map = noise.map((row) => row.map((n) => {
    const v = n + r() * 0.3;
    if (v < waterThreshold) return GLYPHS.water;
    if (v > hillThreshold) return GLYPHS.hill;
    if (v > forestThreshold) return GLYPHS.trees;
    return GLYPHS.grass;
  }));

  const center = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
  map[center.y][center.x] = GLYPHS.town;
  return { map, width, height, player: { ...center }, seedText };
}

function smooth(grid, width, height) {
  return grid.map((row, y) => row.map((_, x) => {
    let neighbors = 0;
    for (let yy = y - 1; yy <= y + 1; yy++) {
      for (let xx = x - 1; xx <= x + 1; xx++) {
        if (xx === x && yy === y) continue;
        if (yy < 0 || xx < 0 || yy >= height || xx >= width) neighbors += 1;
        else neighbors += grid[yy][xx];
      }
    }
    return neighbors >= 5 ? 1 : 0;
  }));
}
