<script>
  import { onMount } from 'svelte'
  import { motion, spawnWave } from './fx.js'

  let { screen, theme } = $props()

  const S = 3, PX = 16, SIZE = PX * S
  const STOP = 46, SPEED = 3, SLEEP_MS = 20000
  const coarse = window.matchMedia('(pointer: coarse)').matches

  // '.'=empty '#'=ink 'a'=accent — art faces left, CSS-flipped when running right
  const SPRITES = {
    sit: [
      '................',
      '................',
      '..#...#.........',
      '..##.##.........',
      '..#####.........',
      '..#a#a#.........',
      '..#####.........',
      '...###..........',
      '..#####.....##..',
      '.#######....#...',
      '.########...#...',
      '.#########..#...',
      '.############...',
      '..##...##.......',
      '................',
      '................',
    ],
    run1: [
      '................',
      '................',
      '................',
      '................',
      '.#..#...........',
      '.####.........#.',
      '.#a#a#.......##.',
      '.#############..',
      '..############..',
      '..##########....',
      '.#..##....##....',
      '#....#......#...',
      '................',
      '................',
      '................',
      '................',
    ],
    run2: [
      '................',
      '................',
      '................',
      '................',
      '.#..#...........',
      '.####.......#...',
      '.#a#a#.....##...',
      '.############...',
      '..###########...',
      '...#########....',
      '...##....##.....',
      '...##....##.....',
      '................',
      '................',
      '................',
      '................',
    ],
    sleep1: [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '...#.#..........',
      '...########.....',
      '..###########...',
      '.#############..',
      '.#############..',
      '..###########...',
      '................',
      '................',
    ],
    sleep2: [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '...#.#..........',
      '..############..',
      '.#############..',
      '.#############..',
      '..###########...',
      '................',
      '................',
    ],
  }

  let el, canvas, ctx
  let bubble = $state('')
  let bubbleBelow = $state(false)
  let bubbleEdge = $state('')
  let bubbleTimer
  let face = 'normal', faceUntil = 0

  let x = window.innerWidth - SIZE - 24
  let y = window.innerHeight - SIZE - 70
  let tx = x, ty = y
  let mode = 'sit', facingRight = false
  let idleSince = Date.now(), wakeUntil = 0, kick = 0
  let animFlip = false, lastAnim = 0, lastRipple = 0, lastFrame = ''
  let petCount = 0, runDist = 0, zoomUntil = 0, zoomPick = 0, lastZoom = 0
  const quipAt = {}
  let lastSayAt = 0

  const POOLS = {
    pet: [
      'do not pet the debugger',
      'again?',
      'purr. ...dammit.',
      'fine. we are friends now.',
      'this is harassment. continue.',
    ],
    wake: ['!', 'I was AWAKE.', 'mrow?!'],
    caught: ['caught you.', 'cardio.', 'I am not paid for this.', 'you run. I chase. economy.'],
    mutter: [
      'no bugs here. I checked.',
      'the cursor is mine. eventually.',
      'he made me in svelte. no framework harmed.',
      'I run at 60fps. what do YOU do.',
      'this pixel grid? my litter box.',
      'READY. it says. ready for WHAT.',
    ],
    screen1: ['ah. the day job.', 'he works. I supervise.'],
    screen2: ['"projects". they were itches.', 'I am also a side project.'],
    screen3: ['he replies. eventually.', 'say hi. he gets lonely.'],
    gh: ['code goes brr', 'star it. he checks. daily.'],
    li: ['ah. the tie website.'],
    form: ['no typos. I am watching.', 'he reads these out loud. to me.'],
    keys: ['ooh. keyboard user. respect.', 'arrow keys. old school.'],
    light: ['MY EYES', 'warn me next time.'],
    dark: ['better.', 'night mode. hunting mode.'],
  }
  const pick = (key) => POOLS[key][Math.floor(Math.random() * POOLS[key].length)]

  function say(text, ms) {
    if (!motion) return
    lastSayAt = Date.now()
    bubble = text
    clearTimeout(bubbleTimer)
    bubbleTimer = setTimeout(() => (bubble = ''), ms || Math.max(3200, text.length * 120))
  }
  function setFace(f, ms) {
    face = f
    faceUntil = Date.now() + ms
    lastFrame = ''
  }
  function quip(key, cooldown = 30000) {
    const now = Date.now()
    if (now - lastSayAt < 5000) return
    if (quipAt[key] && now - quipAt[key] < cooldown) return
    quipAt[key] = now
    say(pick(key))
  }

  // left-eye pixel per frame; faces are drawn as overlays relative to it
  const FACE_ANCHOR = { sit: [3, 5], run1: [2, 6], run2: [2, 6] }

  function draw(name) {
    const key = name + '|' + face
    if (key === lastFrame) return
    lastFrame = key
    const st = getComputedStyle(document.body)
    const ink = st.getPropertyValue('--ink').trim() || '#1b1a15'
    const accent = st.getPropertyValue('--accent').trim() || '#2f9e5b'
    const paper = st.getPropertyValue('--paper').trim() || '#f7f5ee'
    ctx.clearRect(0, 0, SIZE, SIZE)
    const map = SPRITES[name]
    for (let ry = 0; ry < PX; ry++) {
      for (let rx = 0; rx < PX; rx++) {
        const c = map[ry][rx]
        if (c === '.') continue
        ctx.fillStyle = c === 'a' ? accent : ink
        ctx.fillRect(rx * S, ry * S, S, S)
      }
    }
    const anchor = FACE_ANCHOR[name]
    if (!anchor) return
    const [ex, ey] = anchor
    const px = (cx, cy, col) => {
      ctx.fillStyle = col
      ctx.fillRect(cx * S, cy * S, S, S)
    }
    if (face === 'blink' || face === 'happy') {
      px(ex, ey, paper); px(ex + 2, ey, paper)               // closed eyes
      if (face === 'happy') px(ex + 1, ey + 2, paper)        // little smile
    } else if (face === 'annoyed') {
      px(ex, ey - 1, paper); px(ex + 2, ey - 1, paper)       // half-lids
    } else if (face === 'wide' || face === 'derp') {
      px(ex, ey - 1, accent); px(ex + 2, ey - 1, accent)     // big eyes
      if (face === 'derp') { px(ex + 1, ey + 2, paper); px(ex + 1, ey + 3, paper) } // tongue out
    }
  }

  function place() {
    el.style.transform = `translate(${x}px, ${y}px)`
    canvas.style.transform = facingRight ? 'scaleX(-1)' : ''
    const below = y < 70
    if (below !== bubbleBelow) bubbleBelow = below
    const edge = x < 160 ? 'left' : x > window.innerWidth - 160 ? 'right' : ''
    if (edge !== bubbleEdge) bubbleEdge = edge
  }

  function pet() {
    // escalation ladder, not random — repeated petting changes the relationship
    say(POOLS.pet[Math.min(petCount, POOLS.pet.length - 1)])
    setFace(petCount < 3 ? 'annoyed' : 'happy', 2500)
    petCount++
    idleSince = Date.now()
    if (mode === 'sleep') mode = 'sit'
  }

  // theme flip quips — skip initial value
  let prevTheme
  $effect(() => {
    if (prevTheme !== undefined && theme !== prevTheme) {
      quip(theme === 'light' ? 'light' : 'dark', 8000)
    }
    prevTheme = theme
  })

  // screen wipe blows cat sideways; each screen gets a quip
  let prevScreen
  $effect(() => {
    if (prevScreen !== undefined && screen !== prevScreen) {
      if (motion) kick = 8
      const key = 'screen' + screen
      if (POOLS[key]) setTimeout(() => quip(key, 45000), 700)
    }
    prevScreen = screen
  })

  onMount(() => {
    ctx = canvas.getContext('2d')

    if (!motion) {
      // reduced motion: cat sits in the corner, silent
      draw('sit')
      place()
      return
    }

    function onMouse(e) {
      tx = e.clientX
      ty = e.clientY + 14
    }
    function onTouch(e) {
      tx = e.touches[0].clientX
      ty = e.touches[0].clientY + 14
    }
    function onOver(e) {
      if (!e.target.closest) return
      if (e.target.closest('a[href*="github.com"]')) quip('gh')
      else if (e.target.closest('a[href*="linkedin.com"]')) quip('li')
    }
    function onFocus(e) {
      const t = e.target.tagName
      if (t === 'INPUT' || t === 'TEXTAREA') {
        quip('form', 45000)
        setFace('wide', 2500)
      }
    }
    function onKeys(e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') quip('keys', 90000)
    }
    if (!coarse) window.addEventListener('mousemove', onMouse)
    if (coarse) window.addEventListener('touchstart', onTouch)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('focusin', onFocus)
    window.addEventListener('keydown', onKeys)

    // ponytail: coarse pointers have no cursor to chase — wander instead
    const wander = coarse
      ? setInterval(() => {
          tx = 40 + Math.random() * (window.innerWidth - 80)
          ty = 80 + Math.random() * (window.innerHeight - 160)
        }, 9000)
      : 0

    let raf, prev = performance.now()
    function loop(t) {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(t - prev, 50)
      prev = t
      const now = Date.now()

      // zoomies: rare burst of sprinting between random points
      if (mode === 'sit' && now - idleSince > 4000 && now - lastZoom > 45000 && Math.random() < 0.002) {
        lastZoom = now
        zoomUntil = now + 2400
        say('ZOOMIES.')
        setFace('derp', 2400)
      }
      const zooming = now < zoomUntil
      if (zooming && now - zoomPick > 350) {
        zoomPick = now
        tx = 40 + Math.random() * (window.innerWidth - 80)
        ty = 80 + Math.random() * (window.innerHeight - 160)
      }

      const dx = tx - (x + SIZE / 2), dy = ty - (y + SIZE / 2)
      const dist = Math.hypot(dx, dy)

      if (kick > 0.5) {
        x += kick * (dt / 16.7)
        kick *= 0.9
        facingRight = true
        mode = 'run'
        idleSince = now
      } else if (mode === 'sleep') {
        if (dist > 70) {
          mode = 'sit'
          say(pick('wake'), 1500)
          setFace('wide', 1500)
          wakeUntil = now + 400
          idleSince = now
        }
      } else if (now < wakeUntil) {
        // startled — frozen for a beat
      } else if (dist > STOP || zooming) {
        mode = 'run'
        if (dist > 0.5) {
          // ease in near the target so arrivals look like a cat, not a missile
          const ease = Math.max(0.35, Math.min(1, (dist - STOP) / 160))
          const v = SPEED * (zooming ? 1.7 : ease) * (dt / 16.7)
          const step = Math.min(v, dist)
          x += (dx / dist) * step
          y += (dy / dist) * step
          runDist += step
        }
        facingRight = dx > 0
        idleSince = now
        if (now - lastRipple > 200) {
          lastRipple = now
          spawnWave(x + SIZE / 2, y + SIZE - 4, { maxR: 2.5, speed: 0.9, squash: 0.7 })
        }
      } else {
        if (mode === 'run') {
          mode = 'sit'
          idleSince = now
          if (runDist > 1200) {
            quip('caught', 20000)
            setFace('happy', 2200)
          }
          runDist = 0
        }
        if (mode === 'sit' && face === 'normal' && Math.random() < 0.004) setFace('blink', 160)
        if (mode === 'sit' && now - idleSince > 6000 && Math.random() < 0.0006) quip('mutter', 25000)
        if (mode === 'sit' && now - idleSince > SLEEP_MS) {
          mode = 'sleep'
          say('zzz', 3000)
        }
      }

      if (face !== 'normal' && now > faceUntil) {
        face = 'normal'
        lastFrame = ''
      }

      x = Math.max(2, Math.min(window.innerWidth - SIZE - 2, x))
      y = Math.max(2, Math.min(window.innerHeight - SIZE - 2, y))

      if (t - lastAnim > (mode === 'sleep' ? 900 : 140)) {
        lastAnim = t
        animFlip = !animFlip
        lastFrame = '' // theme/accent may have changed; force redraw
      }
      draw(mode === 'run' ? (animFlip ? 'run1' : 'run2') : mode === 'sleep' ? (animFlip ? 'sleep1' : 'sleep2') : 'sit')
      place()
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      if (!coarse) window.removeEventListener('mousemove', onMouse)
      if (coarse) window.removeEventListener('touchstart', onTouch)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('focusin', onFocus)
      window.removeEventListener('keydown', onKeys)
      if (wander) clearInterval(wander)
      clearTimeout(bubbleTimer)
    }
  })
</script>

<div id="cat" bind:this={el} onclick={pet} aria-hidden="true">
  {#if bubble}
    <div class="bubble px {bubbleEdge}" class:below={bubbleBelow}>{bubble}</div>
  {/if}
  <canvas bind:this={canvas} width={SIZE} height={SIZE}></canvas>
</div>

<style>
  #cat {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 150;
    width: 48px;
    height: 48px;
    cursor: pointer;
  }
  canvas {
    display: block;
    image-rendering: pixelated;
  }
  .bubble {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 10px;
    letter-spacing: 0.05em;
    padding: 5px 8px;
    border: 2px solid var(--ink);
    background: var(--paper);
    color: var(--ink);
    pointer-events: none;
  }
  .bubble::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    width: 6px;
    height: 6px;
    margin-left: -3px;
    background: var(--ink);
  }
  .bubble.below {
    bottom: auto;
    top: calc(100% + 6px);
  }
  .bubble.below::after {
    top: auto;
    bottom: 100%;
  }
  .bubble.left {
    left: 0;
    transform: none;
  }
  .bubble.left::after {
    left: 18px;
  }
  .bubble.right {
    left: auto;
    right: 0;
    transform: none;
  }
  .bubble.right::after {
    left: auto;
    right: 15px;
  }
</style>
