<script>
  let { go } = $props()
</script>

<section class="screen on">
  <div class="inner">
    <div class="eyebrow">&gt; CHAPTER 02 / 04</div>
    <h2>THE DAY JOB</h2>
    <p class="lede">Shipping AI assistants and agent workflows into real networks, by day.</p>
    <div class="cols">
      <div class="card">
        <div class="card-bar"><span>NOKIA — 2025→NOW</span><span class="hide-sm" style="opacity:0.8">– □ ×</span></div>
        <div class="card-body">
          <div class="role">R&amp;D ENGINEER</div>
          <ul>
            <li>Shipped NDAC's customer-facing AI assistant end to end: tool-calling over product docs, cited answers, config actions from chat. 95% on internal evals.</li>
            <li>Figma-to-code pipeline with Figma MCP + Cursor agents, ~40% less repetitive UI work.</li>
            <li>Kafka-backed telemetry dashboards with Redis caching; updates under 10ms.</li>
            <li>Led AI-assisted development adoption for a 30-engineer team.</li>
          </ul>
        </div>
      </div>
      <div class="card">
        <div class="card-bar"><span>BPK TECHNOLOGIES — 2023→25</span><span class="hide-sm" style="opacity:0.8">– □ ×</span></div>
        <div class="card-body">
          <div class="role">ASSOCIATE SOFTWARE ENGINEER</div>
          <ul>
            <li>Automated insurance claims verification: Python scrapers across five providers, logic in .NET.</li>
            <li>Dental SaaS reporting at 1M+ patient records a week; Redis caching cut database load 60%.</li>
            <li>Subscription SaaS for 500+ users: React, .NET APIs, Azure DevOps CI/CD, Stripe.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="next-row">
      <button class="btn solid" onclick={() => go(2)}>NEXT: THE ITCHES →</button>
    </div>
  </div>
</section>
