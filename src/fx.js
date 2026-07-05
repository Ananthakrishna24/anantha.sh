export const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const waves = []

export const wipe = { start: null }

export function spawnWave(x, y, opts) {
  waves.push({ x, y, r: 0.5, speed: 1.6, maxR: 30, squash: 1, seed: Math.random() * 997, ...opts })
}

export function startWipe() {
  wipe.start = performance.now()
}
