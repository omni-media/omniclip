import {html, shadowView} from "@benev/slate"
import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"

export const Developers = shadowView(use => () => {
  use.styles(themeCss, styleCss)

  return html`
    <section class="developers" id="developers">
      <header class="dev-head">
        <div class="title-row">
          <div class="badges">
            <span class="badge badge--dev" aria-label="For developers">For Developers</span>
            <span class="badge badge--eco" aria-label="Part of Omniclip ecosystem">Omniclip Ecosystem</span>
            <span class="badge badge--version" aria-label="SDK version">v0.1</span>
          </div>
          <h2>Omnitool SDK</h2>
        </div>
        <p class="section-intro">
          Take full control of video editing through code, automation, or CI/CD pipelines.
        </p>
      </header>

      <!-- Full-width code stage with tabs + persistent preview -->
      <div class="code-stage">
        <div class="tabs">
          <input type="radio" id="tab-api"  name="devtabs" checked>
          <input type="radio" id="tab-cli"  name="devtabs">
          <input type="radio" id="tab-json" name="devtabs">

          <div class="tab-bar">
            <label for="tab-api">API</label>
            <label for="tab-cli">CLI</label>
            <label for="tab-json">Format</label>
          </div>

          <div class="tab-panels">
            <!-- API -->
            <section class="panel">
              <div class="code-preview window">
                <div class="win-bar"><span></span><span></span><span></span><em>TypeScript</em></div>
<pre><code>// Create a timeline programmatically
const watermark = subtitle("omniclip")
const xfade = crossfade(500)

const timeline = sequence(
  video("opening-credits.mp4"),
  xfade,
  stack(video("skateboarding.mp4"), watermark),
  xfade,
  stack(video("biking.mp4"), watermark)
)</code></pre>
              </div>
            </section>

            <!-- CLI -->
            <section class="panel">
              <div class="code-preview terminal">
                <div class="win-bar"><span></span><span></span><span></span><em>Shell</em></div>
<pre><code>$ omnitool render project.json --output out/video.mp4
✓ Loaded project.json
✓ Timeline validated
▶ Encoding... 100% (00:41)
✨ Done! Saved to out/video.mp4

$ omnitool batch-render ./projects/* --output-dir ./exports
• ./projects/intro.json   → ./exports/intro.mp4
• ./projects/trailer.json → ./exports/trailer.mp4
✨ All jobs complete</code></pre>
              </div>
            </section>

            <!-- JSON -->
            <section class="panel">
              <div class="code-preview window">
                <div class="win-bar"><span></span><span></span><span></span><em>JSON</em></div>
<pre><code>{
  "root": "root-1",
  "items": [
    ["root-1", ["sequence", { "children": ["video-1", "stack-1"] }]],
    ["video-1", ["video", { "src": "opening-credits.mp4" }]],
    ["stack-1", ["stack", { "children": ["text-1", "audio-1"] }]],
    ["text-1", ["text", { "text": "omniclip" }]],
    ["audio-1", ["audio", { "src": "music.mp3" }]]
  ]
}</code></pre>
              </div>
            </section>
          </div>
        </div>

        <!-- Persistent preview (visible for all tabs) -->
        <aside class="preview">
          <div class="preview-card">
            <div class="preview-header">
              <span class="dot"></span>
              <span class="label">Preview</span>
              <span class="fps">1920×1080 • 30fps</span>
            </div>

            <div class="preview-frame">
              <!-- faux layers reflecting the idea -->
              <div class="layer opening-credits">Opening Credits</div>

              <!-- watermark like in code -->
              <div class="watermark">omniclip</div>

              <!-- subtle safe area -->
              <div class="safe-area"></div>
            </div>

            <!-- transport (no fake timeline) -->
            <div class="transport">
              <button class="btn-transport" aria-label="Rewind">⟸</button>
              <button class="btn-transport play" aria-label="Play/Pause">▶</button>
              <button class="btn-transport" aria-label="Forward">⟹</button>
              <div class="timecode">00:00:13 / 00:00:30</div>
            </div>
          </div>
        </aside>
      </div>

      <!-- Below: concise feature copy/cards -->
      <div class="dev-features">
        <article class="card">
          <h3>Omni Tools API</h3>
          <ul class="feature-list">
            <li>Modular library for code-driven video editing</li>
            <li>Core primitives + timeline format + templates</li>
          </ul>
        </article>

        <article class="card">
          <h3>CLI Automation</h3>
          <ul class="feature-list">
            <li>Headless rendering for CI/CD</li>
            <li>Batch exports and pipelines</li>
          </ul>
        </article>

        <article class="card">
          <h3>Omni Timeline Format</h3>
          <ul class="feature-list">
            <li>Documented JSON schema</li>
            <li>AI/automation friendly</li>
          </ul>
        </article>

        <a class="github-btn" href="https://github.com/omni-media/omniclip" target="_blank" rel="noopener">
          <sl-icon name="github"></sl-icon> View on GitHub
        </a>
      </div>
    </section>
  `
})

