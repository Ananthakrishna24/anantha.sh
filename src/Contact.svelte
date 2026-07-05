<script>
  let revealed = $state(false)
  let name = $state('')
  let email = $state('')
  let msg = $state('')

  function addr() {
    return ['ananthaak', '24'].join('') + String.fromCharCode(64) + ['outlook', 'com'].join('.')
  }

  function submit(e) {
    e.preventDefault()
    const subject = encodeURIComponent(name ? 'Hello from ' + name : 'Hello')
    const body = encodeURIComponent((msg || '') + (name || email ? '\n\n— ' + [name, email].filter(Boolean).join(' · ') : ''))
    window.location.href = 'mailto:' + addr() + '?subject=' + subject + '&body=' + body
  }
</script>

<section class="screen on">
  <div class="inner cols" style="margin:auto;gap:40px;align-items:center">
    <div>
      <div class="eyebrow">&gt; CHAPTER 04 / 04</div>
      <h2>YOUR MOVE.</h2>
      <p class="lede" style="font-size:15.5px;line-height:1.7;opacity:0.8;max-width:420px;margin-top:18px">Building something interesting? The itch is contagious. Write a message — sending opens your mail app with everything filled in.</p>
      <div class="links" style="margin-top:24px;gap:14px">
        <a class="btn sm" style="background:var(--paper)" href="https://github.com/Ananthakrishna24" target="_blank" rel="noreferrer">GITHUB ↗</a>
        <a class="btn sm" style="background:var(--paper)" href="https://www.linkedin.com/in/ananthakrishna-s-1a83841b0/" target="_blank" rel="noreferrer">LINKEDIN ↗</a>
      </div>
    </div>
    <div class="card">
      <div class="card-bar"><span>SAY_HELLO.EXE</span><span class="hide-sm" style="opacity:0.8">– □ ×</span></div>
      <form class="card-body" style="display:flex;flex-direction:column;gap:16px;padding:22px 22px 26px" onsubmit={submit}>
        <label><span>YOUR NAME</span><input name="name" placeholder="Jane Doe" autocomplete="name" bind:value={name}></label>
        <label><span>YOUR EMAIL</span><input name="email" type="email" placeholder="jane@example.com" autocomplete="email" bind:value={email}></label>
        <label><span>MESSAGE</span><textarea name="msg" rows="3" placeholder="What are you building?" bind:value={msg}></textarea></label>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
          <button type="submit" class="btn solid" style="font-size:11.5px;padding:12px 22px">SEND ↗</button>
          {#if revealed}
            <span id="email-text" class="px" style="font-size:10.5px;opacity:0.75">{addr()}</span>
          {:else}
            <button type="button" id="reveal-btn" onclick={() => revealed = true}>MAIL APP NOT OPENING?</button>
          {/if}
        </div>
      </form>
    </div>
  </div>
</section>
