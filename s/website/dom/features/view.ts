import {html, shadowView, repeat} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"

const features = [
  {
    type: "carousel",
    title: "AI",
    description: "Local AI features powered by Transformers.js — private by design.",
    class: "ai",
    render: () => html`
      <sl-carousel loop autoplay pagination navigation mouse-dragging style="--carousel-height: 460px;">
        <!-- Splash -->
        <sl-carousel-item>
          <article class="ai-splash">
            <header class="ai-head">
              <span class="chip chip-green">Runs locally</span>
              <span class="chip">No uploads</span>
              <span class="chip">Private by design</span>
            </header>

            <h3 class="ai-title">
              AI in your browser
              <span class="ai-sub">Powered by your device - no server roundtrips.</span>
            </h3>

            <div class="ai-body">
              <div class="left">
                <div class="logo-row">
                  <span class="logo badge">
                    <svg viewBox="0 0 256 256" aria-hidden="true">
                      <path fill="currentColor" d="M128 16 16 72v112l112 56 112-56V72L128 16zM64 92l64-32 64 32v72l-64 32-64-32V92z"/>
                    </svg>
                    <strong>Transformers.js</strong>
                  </span>
                  <span class="logo">WebGPU · WebGL</span>
                  <span class="logo">ONNX Runtime Web</span>
                </div>

                <ul class="bullets">
                  <li><strong>Background remover</strong> high-quality matting in the browser.</li>
                  <li><strong>Speech → Text</strong> fast on-device transcription.</li>
                  <li><strong>Upscaler</strong> upscale your image or video seamlessly.</li>
                  <li><strong>Models</strong> select from various models, smaller or bigger.</li>
                </ul>

                <div class="cta-row">
                  <sl-button class="cta-btn" variant="primary" size="large">
                    ✂️ Try Background Remover
                  </sl-button>
                  <sl-button class="cta-btn secondary" variant="default" size="large">
                    🎤 Try Speech-to-Text
                  </sl-button>
                </div>
              </div>

              <div class="right big-logo">
              	<div class=logo-box>
									<span class=logo-ai>🤗</span>
                	<span>Transformers.js</span>
                </div>
                <div class=flex>
              		<div class=logo-box>
										<span class=logo-ai><img src="/assets/webgpu.svg"/></span>
                		<span>WebGpu</span>
                	</div>
              		<div class=logo-box>
										<span class=logo-ai><img src="/assets/ort.svg"/></span>
                		<span>ONNX Runtime</span>
                	</div>
                </div>
              </div>
            </div>
          </article>
        </sl-carousel-item>

        <!-- Background Remover demo placeholder -->
        <sl-carousel-item>
          <article class="ai-splash bg-remover">
            <h3 class="ai-title">Background Remover</h3>
            <p class="ai-sub">Upload image and watch your background being removed live in your browser.</p>

            <div class="stt-ui">
              <!-- Upload -->
              <div class="stt-upload">
                <sl-input type="file" accept="audio/*"></sl-input>
              </div>
							<div class=box>
              	<!-- Model loading -->
              	<div class="stt-models">
                	<span class="stt-label">Loading model…</span>
                	<ul>
                  	<li><sl-spinner></sl-spinner> Whisper small.en</li>
                  	<li><sl-spinner></sl-spinner> Tokenizer</li>
                  	<li><sl-spinner></sl-spinner> Feature extractor</li>
                	</ul>
              	</div>
              	<sl-image-comparer>
  								<img
    								slot="before"
    								src="https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80&sat=-100&bri=-5"
    								alt="Grayscale version of kittens in a basket looking around."
  								/>
  								<img
    								slot="after"
    								src="https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
    								alt="Color version of kittens in a basket looking around."
  								/>
								</sl-image-comparer>
							</div>
            </div>
          </article>
        </sl-carousel-item>

        <!-- Speech-to-Text demo UI -->
        <sl-carousel-item>
          <article class="ai-splash speech-to-text">
            <h3 class="ai-title">Speech-to-Text</h3>
            <p class="ai-sub">Upload audio and watch transcription live in your browser.</p>

            <div class="stt-ui">
              <!-- Upload -->
              <div class="stt-upload">
                <sl-input type="file" accept="audio/*"></sl-input>
                <sl-checkbox>Multilingual</sl-checkbox>
              </div>
							<div class=stt-box>
              	<!-- Model loading -->
              	<div class="stt-models">
                	<span class="stt-label">Loading model…</span>
                	<ul>
                  	<li><sl-spinner></sl-spinner> Whisper small.en</li>
                  	<li><sl-spinner></sl-spinner> Tokenizer</li>
                  	<li><sl-spinner></sl-spinner> Feature extractor</li>
                	</ul>
              	</div>
              	<div class=box>
              		<!-- Progress -->
              		<div class="stt-progress">
                		<span class="stt-label">Transcribing…</span>
                		<sl-progress-bar value="45"></sl-progress-bar>
              		</div>

              		<!-- Output -->
              		<div class="stt-output">
              			<span>Output</span>
										<sl-spinner></sl-spinner>
              		</div>
              	</div>
              </div>

            </div>
          </article>
        </sl-carousel-item>
      </sl-carousel>
    `
  },

  // 🔹 Other features unchanged...
  {
    title: "Animations",
    description: "Cycle through our 7 animation styles to bring your content to life.",
    class: "animations",
    is_animated_showcase: true,
    icon: html`<div>✨</div>`
  },
  {
    title: "Filters",
    description: "Choose from over 30 stackable filters to create a unique aesthetic.",
    class: "filters",
    video: "/assets/filters.mp4",
    icon: html`<sl-icon name="transparency"></sl-icon>`
  },
  {
    title: "Local Fonts",
    description: "Instantly use your own fonts without uploading anything.",
    class: "fonts",
    icon: html`<sl-icon name="type"></sl-icon>`
  },
  {
    title: "Fast Export",
    description: "Render and download your final projects at lightning speed.",
    class: "export",
    icon: html`<sl-icon name="rocket"></sl-icon>`
  },
  {
    title: "Large Files",
    description: "Edit massive 4K files smoothly without crashing your browser.",
    class: "files",
    icon: html`<sl-icon name="file-earmark-play"></sl-icon>`
  },
  {
    class: "transitions",
    video: "/assets/tr1.mp4",
    icon: html`<sl-icon name="film-slate"></sl-icon>`,
    render: () => html`
			<div class=box>
      	<div class="card-header">
        	<div class="card-icon"><sl-icon name="hypnotize"></sl-icon></div>
        	<h3>Transitions</h3>
      	</div>
				<p>Access a huge collection of high-quality</p>
				<p>open-source transitions.</p>
			</div>
      <div class="card-visual">
        <video autoplay loop muted playsinline src="/assets/tr1.mp4"></video>
      </div>

		`
  }
]

export const Features = shadowView(use => () => {
  use.styles(themeCss, styleCss)
  use.mount(() => {
    const animations = ['fade-in-down','slide-in-up','bounce-in','zoom-in','tada','blur-in','pulse']
    let currentIndex = 0
    const cycle = () => {
      const el = use.shadow.querySelector('#animation-skeleton')
      if (!el) return
      el.classList.remove(...animations)
      setTimeout(() => {
        el.classList.add(animations[currentIndex])
        currentIndex = (currentIndex + 1) % animations.length
      }, 10)
    }
    cycle()
    const id = setInterval(cycle, 2500)
    return () => clearInterval(id)
  })

  return html`
    <section class="features">
      <div class="features-header">
        <h2>Features</h2>
        <p>Bring your creative vision to life with powerful, intuitive tools.</p>
      </div>

      <ul class="feature-grid">
        ${repeat(features, f => f.title ?? f.type, feature => html`
          <li class="feature-card ${feature.class ?? ""}">
            ${feature.type === "carousel" ? feature.render?.() : html`
              ${feature.is_animated_showcase ? html`
                <div class="card-header">
                  <div class="card-icon">${feature.icon}</div>
                  <h3>${feature.title}</h3>
                </div>
                <p>${feature.description}</p>
                <div class="animation-demo-container">
                  <div id="animation-skeleton">
                    <sl-icon name="card-image"></sl-icon>
                  </div>
                </div>
              ` : feature.render ? feature.render() : html`
                <div class="card-header">
                  <div class="card-icon">${feature.icon}</div>
                  <h3>${feature.title}</h3>
                </div>
                ${feature.description ? html` <p>${feature.description}</p>` : null}
                <div class="card-visual">
                  ${feature.video ? html`
                    <video autoplay loop muted playsinline src="${feature.video}"></video>
                  ` : ""}
                </div>
              `}
            `}
          </li>
        `)}
      </ul>
    </section>
  `
})

