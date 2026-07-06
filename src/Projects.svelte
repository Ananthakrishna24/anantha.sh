<script>
  let { go } = $props()
</script>

<section class="screen on">
  <div class="inner">
    <div class="eyebrow">&gt; CHAPTER 03 / 04</div>
    <h2>STARTED AS AN ITCH</h2>
    <p class="lede">Built at night, because they wouldn't leave me alone.</p>
    <div class="cols">
      <div class="card">
        <div class="card-bar"><span>MINICODE</span><span class="hide-sm" style="opacity:0.8">– □ ×</span></div>
        <div class="card-body">
          <div class="role">A CODING AGENT IN A TERMINAL</div>
          <ul>
            <li>Reads, writes, runs shell commands, keeps memory across steps: an LLM tool loop, no IDE.</li>
            <li>Modular tool registry: workspace-confined file ops, grep/glob, diff review, spawnable helper agents.</li>
            <li>OpenRouter, OpenAI, Mistral; ships as a global npm CLI.</li>
          </ul>
          <div class="stack">TYPESCRIPT · NODE.JS · INK</div>
          <a class="btn sm" style="margin-top:18px" href="https://github.com/Ananthakrishna24/mini-coding-agent" target="_blank" rel="noreferrer">GITHUB ↗</a>
        </div>
      </div>
      <div class="card">
        <div class="card-bar"><span>QUIRO</span><span class="hide-sm" style="opacity:0.8">– □ ×</span></div>
        <div class="card-body">
          <div class="role">ASK YOUR BANK STATEMENT ANYTHING</div>
          <ul>
            <li>Plain-language questions over transactions; insights stream back as they're generated.</li>
            <li>FastAPI over WebSockets; every model output schema-validated; failed parses retried, never shown.</li>
            <li>RAG on pgvector for semantic search over transaction history.</li>
          </ul>
          <div class="stack">PYTHON · FASTAPI · PGVECTOR</div>
          <a class="btn sm" style="margin-top:18px" href="https://quiro-ai-flax.vercel.app/" target="_blank" rel="noreferrer">LIVE APP ↗</a>
        </div>
      </div>
    </div>
    <div class="next-row">
      <button class="btn solid" onclick={() => go(3)}>NEXT: YOUR MOVE →</button>
    </div>
  </div>
</section>
