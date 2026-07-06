<script>
  import { onMount } from 'svelte'
  import { motion, spawnWave } from './fx.js'

  let { go, onflip } = $props()

  const FRONT = 'ANANTHA'
  const BACK = 'KRISHNA'
  let flip = $state(false)
  let flipped = $state([false, false, false, false, false, false, false])
  let delays = $state([0, 1, 2, 3, 4, 5, 6].map((i) => i * 0.07))
  const lastHover = {}
  const letterEls = []

  function trigger(i) {
    const now = Date.now()
    if (lastHover[i] && now - lastHover[i] < 500) return
    lastHover[i] = now
    delays[i] = 0
    if (motion) {
      const r = letterEls[i].getBoundingClientRect()
      spawnWave(r.left + r.width / 2, r.top + r.height / 2, { maxR: 9, speed: 1.3, squash: 0.75 })
    }
    flipped[i] = !flipped[i]
  }

  onMount(() => {
    const id = setInterval(() => {
      if (!motion) return
      delays = [0, 1, 2, 3, 4, 5, 6].map((i) => i * 0.07)
      flip = !flip
      flipped = [false, false, false, false, false, false, false]
      onflip()
    }, 5000)
    return () => clearInterval(id)
  })
</script>

<section class="screen on">
  <div class="inner">
    <div class="eyebrow">&gt; HAI, I'M<span class="caret"></span></div>
    <h1 aria-label="Ananthakrishna">
      {#each FRONT as ch, i}
        <span
          class="letter"
          bind:this={letterEls[i]}
          onmouseenter={() => trigger(i)}
          ontouchstart={() => trigger(i)}
        >
          <span
            class="flipbox"
            style="transition-delay:{delays[i]}s;transform:rotateX({flip !== flipped[i] ? 180 : 0}deg)"
          >
            <span class="front">{ch}</span><span class="back">{BACK[i]}</span>
          </span>
        </span>
      {/each}
    </h1>
    <div class="sub px">SOFTWARE ENGINEER · BANGALORE, IN · UTC+05:30</div>
    <p class="lede" style="font-size:16.5px;line-height:1.7;opacity:1;margin-top:30px">I like tools that stay out of the way — small, fast, and honest about what they do. Most of what I build starts as an itch. Lately the itch is agents.</p>
    <div class="links" style="margin-top:34px">
      <a class="btn" href="https://github.com/Ananthakrishna24" target="_blank" rel="noreferrer">GITHUB ↗</a>
      <a class="btn" href="https://www.linkedin.com/in/ananthakrishna-s-1a83841b0/" target="_blank" rel="noreferrer">LINKEDIN ↗</a>
    </div>
    <div class="next-row" style="margin-top:44px">
      <button class="btn solid" onclick={() => go(1)}>NEXT: THE DAY JOB →</button>
    </div>
  </div>
</section>
