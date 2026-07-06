<script>
  import { onMount } from 'svelte'

  let { oncontact } = $props()
  let show = $state(false)

  onMount(() => {
    if (localStorage.getItem('v6-intro')) return
    const t = setTimeout(() => (show = true), 2000)
    return () => clearTimeout(t)
  })

  function close() {
    show = false
    localStorage.setItem('v6-intro', '1')
  }
</script>

<svelte:window onkeydown={(e) => show && e.key === 'Escape' && close()} />

{#if show}
  <div class="intro-wrap" role="dialog" aria-modal="true" aria-label="Welcome">
    <div class="intro card">
      <div class="card-bar px">
        <span>HELLO.TXT</span>
        <button class="x px" onclick={close} aria-label="Close">✕</button>
      </div>
      <div class="body">
        <p>maybe my resume brought you here. maybe a link, or the universe itself. either way, welcome. glad you made it.</p>
        <p>i love building things. this folio is one of them: made in my free time, for the joy of it. so click around. pet the cat. keep going. you'll know when to stop.</p>
        <p>recruiter? building something of your own? say hi on the contact page or mail me directly. tell me what you're making. i'd genuinely love to pitch in.</p>
        <div class="row">
          <button class="btn sm px" onclick={close}>EXPLORE →</button>
          <button class="btn sm px" onclick={() => { close(); oncontact() }}>CONTACT</button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .intro-wrap {
    position: fixed;
    inset: 0;
    z-index: 160;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.35);
    animation: introFade 0.3s both;
  }
  .intro {
    max-width: 440px;
    width: 100%;
    animation: introPop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .body { padding: 18px 20px 20px; }
  .body p {
    margin: 0 0 12px;
    font-size: 13.5px;
    line-height: 1.65;
    opacity: 0.85;
  }
  .row { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
  .x {
    border: none;
    background: none;
    color: var(--paper);
    font-size: 11px;
    cursor: pointer;
    padding: 0 2px;
  }
  .x:hover { color: var(--accent); }
  @keyframes introFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes introPop { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
</style>
