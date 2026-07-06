<script>
  import { onMount } from 'svelte'
  import { motion, spawnWave, startWipe } from './fx.js'
  import PixelCanvas from './PixelCanvas.svelte'
  import Cat from './Cat.svelte'
  import Hello from './Hello.svelte'
  import Work from './Work.svelte'
  import Projects from './Projects.svelte'
  import Contact from './Contact.svelte'
  import Intro from './Intro.svelte'

  const accents = ['#2f9e5b', '#3b6fd9', '#d9772f', '#c74b8f']
  const tabs = ['01 HELLO', '02 WORK', '03 PROJECTS', '04 CONTACT']
  const screens = [Hello, Work, Projects, Contact]

  const saved = localStorage.getItem('v6-theme')
  let theme = $state(saved === 'light' ? 'light' : 'dark')
  let screen = $state(0)
  let accentIdx = $state(0)
  let clock = $state('')
  const copy = '© ' + new Date().getFullYear() + ' ANANTHAKRISHNA S'

  $effect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('v6-theme', theme)
  })
  $effect(() => {
    document.documentElement.style.setProperty('--accent', screen === 0 ? accents[accentIdx % accents.length] : accents[screen])
  })

  function goTo(i) {
    if (i === screen) return
    screen = i
    if (motion) startWipe()
  }
  function nav(d) {
    goTo((screen + d + 4) % 4)
  }

  function onKey(e) {
    const t = e.target.tagName
    if (t === 'INPUT' || t === 'TEXTAREA') return
    if (e.key === 'ArrowRight') nav(1)
    if (e.key === 'ArrowLeft') nav(-1)
    const n = parseInt(e.key, 10)
    if (n >= 1 && n <= 4) goTo(n - 1)
  }

  let touchX = null
  function touchStart(e) {
    touchX = e.touches[0].clientX
  }
  function touchEnd(e) {
    if (touchX === null) return
    const dx = e.changedTouches[0].clientX - touchX
    touchX = null
    if (Math.abs(dx) > 70) nav(dx < 0 ? 1 : -1)
  }

  function toggleTheme(e) {
    const next = theme === 'dark' ? 'light' : 'dark'
    if (motion) {
      const r = e.currentTarget.getBoundingClientRect()
      const maxR = Math.hypot(window.innerWidth, window.innerHeight) / 14 + 8
      spawnWave(r.left + r.width / 2, r.top + r.height / 2, { maxR, speed: 5, squash: 1 })
      setTimeout(() => { theme = next }, 220)
    } else {
      theme = next
    }
  }

  onMount(() => {
    const id = setInterval(() => {
      clock = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date()) + ' IST'
    }, 1000)
    return () => clearInterval(id)
  })

  const Screen = $derived(screens[screen])
</script>

<svelte:window onkeydown={onKey} />

<PixelCanvas />
<Cat {screen} {theme} />
<Intro oncontact={() => goTo(3)} />

<header class="px">
  <span>ANANTH.EXE</span>
  <nav>
    {#each tabs as label, i}
      <button data-active={String(i === screen)} onclick={() => goTo(i)}>{label}</button>
    {/each}
  </nav>
</header>

<main ontouchstart={touchStart} ontouchend={touchEnd}>
  {#key screen}
    {#if screen === 0}
      <Hello go={goTo} onflip={() => accentIdx++} />
    {:else}
      <Screen go={goTo} />
    {/if}
  {/key}
</main>

<footer>
  <span><span class="dot"></span>READY.</span>
  <button aria-label="Previous screen" onclick={() => nav(-1)}>←</button>
  <button aria-label="Next screen" onclick={() => nav(1)}>→</button>
  <span class="dim">SCR {screen + 1}/4</span>
  <span class="dim hide-sm">{copy}</span>
  <button id="theme-btn" onclick={toggleTheme}>◐ {theme === 'dark' ? 'LIGHT' : 'DARK'}</button>
  <span class="hide-sm" id="clock">{clock}</span>
</footer>
