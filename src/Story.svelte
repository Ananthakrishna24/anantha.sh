<script>
  import { onMount } from 'svelte'
  import { CAT } from './sprites.js'

  let { onclose } = $props()

  // logical 128x72 movie screen, upscaled with pixelated rendering
  const W = 128, H = 72, GROUND = 63
  // night palette by default; onMount swaps to day colors on the light theme
  let FG = '#eae7da', BG = '#12110d', light = false
  let canvas, ctx, accent = '#2f9e5b'

  let idx = $state(0)
  let shown = $state('')
  let sub = $state('')
  let big = $state(false)
  let closing = $state(false)

  // fixed pseudo-random starfield — stable across frames
  const STARS = Array.from({ length: 40 }, (_, i) => [(i * 37 + 11) % W, (i * 23 + 5) % 38])

  const CURSOR = [
    '#........',
    '##.......',
    '###......',
    '####.....',
    '#####....',
    '######...',
    '#######..',
    '####.....',
    '#..##....',
    '....##...',
  ]
  const MOUSE = [
    '..##........',
    '.####.......',
    '#a######....',
    '.#########..',
    '..########.#',
    '...#..#..##.',
  ]
  const HEART = [
    '.##.##.',
    '#######',
    '#######',
    '.#####.',
    '..###..',
    '...#...',
  ]
  const MOON = [
    '...####....',
    '..##.......',
    '.##........',
    '.#.........',
    '##.........',
    '##.........',
    '##.........',
    '.#.........',
    '.##........',
    '..##.......',
    '...####....',
  ]
  const Z = ['###', '.#.', '###']
  const SUN = [
    '..#####..',
    '.#######.',
    '#########',
    '#########',
    '#########',
    '#########',
    '#########',
    '.#######.',
    '..#####..',
  ]
  const CLOUD = [
    '...####....',
    '.########..',
    '###########',
  ]

  function sp(map, x, y, flip = false, fg = FG) {
    for (let r = 0; r < map.length; r++)
      for (let c = 0; c < map[r].length; c++) {
        const ch = map[r][c]
        if (ch === '.') continue
        ctx.fillStyle = ch === 'a' ? accent : fg
        ctx.fillRect(Math.round(x) + (flip ? map[r].length - 1 - c : c), Math.round(y) + r, 1, 1)
      }
  }
  const px = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, w, h) }
  const bang = (x, y) => { px(x, y, 2, 5, accent); px(x, y + 6, 2, 2, accent) }
  const heart = (x, y, a = 1) => { ctx.globalAlpha = Math.max(0, a); sp(HEART, x, y, false, accent); ctx.globalAlpha = 1 }
  const easeOut = (t) => t * (2 - t)

  function night(sky = true) {
    px(0, 0, W, H, BG)
    if (light) {
      if (sky) {
        sp(SUN, 105, 7, false, accent)
        ctx.globalAlpha = 0.3
        sp(CLOUD, 14, 12, false, FG)
        sp(CLOUD, 62, 20, false, FG)
        ctx.globalAlpha = 1
      }
    } else {
      ctx.globalAlpha = 0.5
      for (const [sx, sy] of STARS) px(sx, sy, 1, 1, FG)
      ctx.globalAlpha = 1
      if (sky) sp(MOON, 104, 6)
    }
    ctx.globalAlpha = 0.22
    px(0, GROUND, W, 1, FG)
    ctx.globalAlpha = 1
  }

  // cat feet: sit row 14 → y 47, run row ~11 → y 51, sleep row 13 → y 49
  const scenes = [
    { dur: 5000, big: true, cap: 'THE CURSOR & THE CAT', sub: 'a true story. mostly.', draw() {
      night()
      sp(CAT.sit, 56, 47)
    } },
    { dur: 7000, cap: 'in the beginning there was one cat. and zero visitors.', draw(t) {
      night()
      sp(Math.floor(t * 9) % 3 ? CAT.sit : CAT.sit2, 56, 47)
    } },
    { dur: 7000, cap: 'then one day. YOU arrived.', draw(t) {
      night()
      sp(CAT.sit, 88, 47)
      sp(CURSOR, -12 + 54 * easeOut(Math.min(t / 0.5, 1)), 34)
      if (t > 0.55) bang(92, 34)
    } },
    { dur: 8000, cap: 'you ran. i chased. strictly professional.', draw(t, f) {
      night()
      const ph = t * Math.PI * 4
      const right = Math.cos(ph - 0.9) > 0
      sp(CURSOR, 58 + 44 * Math.sin(ph), 26)
      sp(f ? CAT.run1 : CAT.run2, 58 + 44 * Math.sin(ph - 0.9), 51, right)
    } },
    { dur: 7000, cap: 'until out of nowhere... a BUG appeared.', draw(t, f) {
      night()
      sp(CAT.sit, 22, 47)
      sp(CURSOR, 12, 30)
      sp(MOUSE, 130 - 62 * Math.min(t * 1.6, 1) + (f ? 1 : 0), 57)
      if (t > 0.45) { bang(28, 34); bang(16, 18) }
    } },
    { dur: 8000, cap: 'we handled it. TOGETHER.', draw(t, f) {
      night()
      const mx = 8 + t * 150
      sp(MOUSE, mx + (f ? 1 : 0), 57, true)
      sp(f ? CAT.run1 : CAT.run2, mx - 26, 51, true)
      sp(CURSOR, mx - 44, 30 + (f ? 2 : 0))
    } },
    { dur: 8000, cap: 'then you did the thing. the unforgivable thing. the petting.', draw(t) {
      night()
      sp(CAT.sit, 56, 47)
      sp(CURSOR, 60, 33 + Math.round(Math.sin(t * Math.PI * 8) * 3))
      for (let i = 0; i < 3; i++) {
        const s = 0.3 + i * 0.2
        if (t > s) heart(76 + i * 8, 40 - (t - s) * 45, 1 - (t - s) * 1.6)
      }
    } },
    { dur: 7000, cap: 'six pets later: coworkers. nine pets later: family.', draw(t) {
      night()
      sp(CAT.sit, 46, 47)
      sp(CURSOR, 70, 50)
      sp(MOUSE, 88, 57) // the bug stayed. nobody questions it.
      if (Math.floor(t * 10) % 3 === 0) heart(56, 34)
    } },
    { dur: 6000, big: true, cap: 'THE END', sub: 'we tell NO ONE about this.', draw(t, f) {
      night()
      sp(f ? CAT.sleep1 : CAT.sleep2, 48, 49)
      sp(CURSOR, 72, 52)
      ctx.globalAlpha = 0.8
      sp(Z, 58, 44 - Math.floor((t * 16) % 6))
      sp(Z, 63, 38 - Math.floor((t * 16 + 3) % 6))
      ctx.globalAlpha = 1
    } },
  ]

  let raf, sceneStart = null
  function loop(now) {
    raf = requestAnimationFrame(loop)
    if (closing) return
    if (sceneStart === null) sceneStart = now
    const sc = scenes[idx]
    const el = now - sceneStart
    if (el >= sc.dur) return advance()
    sc.draw(el / sc.dur, Math.floor(now / 150) % 2)
    shown = sc.cap.slice(0, Math.floor(el / 30)) // typewriter
    sub = el > 900 ? sc.sub || '' : ''
    big = !!sc.big
  }

  function advance() {
    if (idx >= scenes.length - 1) return exit()
    idx++
    sceneStart = null
  }

  function exit() {
    if (closing) return
    closing = true
    setTimeout(onclose, 600) // let the CRT-off animation play
  }

  onMount(() => {
    ctx = canvas.getContext('2d')
    const st = getComputedStyle(document.body)
    accent = st.getPropertyValue('--accent').trim() || accent
    light = document.documentElement.dataset.theme === 'light'
    if (light) {
      FG = st.getPropertyValue('--ink').trim() || '#1b1a15'
      BG = st.getPropertyValue('--bg').trim() || '#f3f1e8'
      canvas.style.background = BG
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  })
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && exit()} />

<div class="story" class:closing onclick={advance} role="presentation" aria-hidden="true">
  <div class="frame">
    <canvas bind:this={canvas} width={W} height={H}></canvas>
    <div class="cap px" class:big>
      {shown}
      {#if sub}<span class="sub2">{sub}</span>{/if}
    </div>
  </div>
  <button class="px exit" onclick={(e) => { e.stopPropagation(); exit() }}>✕ END</button>
  <div class="px prog">SCENE {idx + 1}/{scenes.length} · CLICK TO SKIP</div>
</div>

<style>
  .story {
    position: fixed;
    inset: 0;
    z-index: 180;
    background: rgba(10, 9, 7, 0.93);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    cursor: pointer;
    animation: storyFade 0.3s both;
  }
  .story.closing { animation: storyFade 0.3s 0.3s both reverse; }
  .frame {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    animation: crtOn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .closing .frame { animation: crtOff 0.5s ease-in both; }
  canvas {
    width: min(92vw, calc((100dvh - 200px) * 16 / 9));
    aspect-ratio: 16 / 9;
    image-rendering: pixelated;
    background: #12110d;
    border: 2px solid rgba(234, 231, 218, 0.25);
  }
  .cap {
    min-height: 44px;
    max-width: min(92vw, 640px);
    text-align: center;
    font-size: 12px;
    letter-spacing: 0.08em;
    line-height: 1.7;
    color: #eae7da;
  }
  .cap.big { font-size: 20px; color: var(--accent); }
  .sub2 { display: block; font-size: 11px; color: #eae7da; opacity: 0.7; }
  .exit {
    position: absolute;
    top: 18px;
    right: 22px;
    font-family: 'Silkscreen', monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
    border: 2px solid #eae7da;
    background: transparent;
    color: #eae7da;
    padding: 7px 12px;
    cursor: pointer;
  }
  .exit:hover { background: #eae7da; color: #12110d; }
  .prog {
    position: absolute;
    bottom: 16px;
    font-size: 9px;
    letter-spacing: 0.1em;
    color: #eae7da;
    opacity: 0.5;
  }
  @keyframes storyFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes crtOn {
    0% { transform: scale(0, 0.008); }
    45% { transform: scale(1, 0.008); }
    100% { transform: scale(1, 1); }
  }
  @keyframes crtOff {
    0% { transform: scale(1, 1); }
    55% { transform: scale(1, 0.008); }
    100% { transform: scale(0, 0.008); }
  }
</style>
