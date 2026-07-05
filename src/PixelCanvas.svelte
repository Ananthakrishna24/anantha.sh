<script>
  import { onMount } from 'svelte'
  import { motion, waves, wipe } from './fx.js'

  let canvas

  onMount(() => {
    const ctx = canvas.getContext('2d')
    const CELL = 14
    const cells = new Map()
    const coarse = window.matchMedia('(pointer: coarse)').matches
    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    function onMove(e) {
      if (!motion) return
      const gx = Math.floor(e.clientX / CELL), gy = Math.floor(e.clientY / CELL)
      cells.set(gx + ',' + gy, { v: 1, a: true })
      if (Math.random() < 0.45) {
        cells.set((gx + (Math.random() < 0.5 ? 1 : -1)) + ',' + (gy + (Math.random() < 0.5 ? 1 : -1)), { v: 0.7, a: true })
      }
    }
    if (!coarse) window.addEventListener('mousemove', onMove)

    let last = 0
    let raf
    function loop(t) {
      raf = requestAnimationFrame(loop)
      if (t - last < 40) return
      last = t
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (!motion) return
      const styles = getComputedStyle(document.body)
      const accent = styles.getPropertyValue('--accent').trim() || '#2f9e5b'
      const ink = styles.getPropertyValue('--ink').trim() || '#1b1a15'

      if (Math.random() < 0.55 && cells.size < (coarse ? 120 : 400)) {
        const k = Math.floor(Math.random() * (canvas.width / CELL)) + ',' + Math.floor(Math.random() * (canvas.height / CELL))
        if (!cells.has(k)) cells.set(k, { v: 0.55, a: false })
      }
      cells.forEach((cell, k) => {
        cell.v -= cell.a ? 0.045 : 0.02
        if (cell.v <= 0) { cells.delete(k); return }
        const q = Math.ceil(cell.v * 4) / 4
        ctx.globalAlpha = q * (cell.a ? 0.3 : 0.12)
        ctx.fillStyle = cell.a ? accent : ink
        const i = k.indexOf(',')
        ctx.fillRect(+k.slice(0, i) * CELL + 2, +k.slice(i + 1) * CELL + 2, CELL - 4, CELL - 4)
      })

      for (let wi = waves.length - 1; wi >= 0; wi--) {
        const w = waves[wi]
        w.r += w.speed
        w.speed = Math.max(w.speed * 0.972, 0.45)
        const band = 2 + w.r * 0.4
        if (w.r - band > w.maxR) { waves.splice(wi, 1); continue }
        const cx = w.x / CELL, cy = w.y / CELL
        const gx0 = Math.floor(cx - w.r - 1), gx1 = Math.ceil(cx + w.r + 1)
        const gy0 = Math.floor(cy - (w.r + 1) * w.squash), gy1 = Math.ceil(cy + (w.r + 1) * w.squash)
        for (let gx = gx0; gx <= gx1; gx++) {
          for (let gy = gy0; gy <= gy1; gy++) {
            const dx = gx - cx, dy = (gy - cy) / w.squash
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist > w.r || dist < w.r - band) continue
            const density = Math.pow(Math.max(0, 1 - dist / w.maxR), 1.5)
            if (density <= 0) continue
            const h = Math.abs(Math.sin(gx * 127.1 + gy * 311.7 + w.seed) * 43758.5453 % 1)
            if (h > density * 0.95) continue
            const q2 = Math.ceil((0.25 + density * 0.75) * 4) / 4
            ctx.globalAlpha = q2 * 0.55
            ctx.fillStyle = accent
            ctx.fillRect(gx * CELL + 2, gy * CELL + 2, CELL - 4, CELL - 4)
            if (h < density * 0.4) cells.set(gx + ',' + gy, { v: 0.12 + density * 0.3, a: true })
          }
        }
      }

      if (wipe.start) {
        const p = (performance.now() - wipe.start) / 480
        if (p >= 1) { wipe.start = null } else {
          const bandX = p * canvas.width * 1.2 - canvas.width * 0.1
          for (let n = 0; n < 70; n++) {
            const gxw = Math.floor((bandX + (Math.random() - 0.5) * 260) / CELL)
            const gyw = Math.floor(Math.random() * (canvas.height / CELL))
            ctx.globalAlpha = (1 - p) * 0.5 * Math.random()
            ctx.fillStyle = accent
            ctx.fillRect(gxw * CELL + 2, gyw * CELL + 2, CELL - 4, CELL - 4)
          }
        }
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      if (!coarse) window.removeEventListener('mousemove', onMove)
    }
  })
</script>

<canvas id="fx" bind:this={canvas} aria-hidden="true"></canvas>
