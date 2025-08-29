import {css} from "@benev/slate"

export default css`
:host {
  --bg: #141110;
  --surface: #1B1816;
  --text: #E9E4DE;
  --text-muted: #CFC9C2;
  --border: rgba(233,228,222,0.14);
  --card: rgba(233,228,222,0.06);
  --card-hover: rgba(233,228,222,0.08);
  --accent: #E0B26E;
  --accent-ink: #1a1613;
  --ring: rgba(224,178,110,0.35);

	display: flex;
	flex-direction: column;
  color: var(--text);
  padding: 6.5rem 1rem;
  max-width: 1100px;
  margin: 0 auto;
}

.dev-head { text-align: center; }

.title-row {
  display: flex;
  gap: 2rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

h2 {
  font-family: Inter, Georgia, serif;
  font-weight: 800;
  letter-spacing: -0.01em;
  font-size: clamp(2rem, 1.25rem + 3vw, 3rem);
  margin: 0;
}

.badges {
  display: inline-flex;
  gap: .45rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: .35em;
  padding: .28em .6em;
  border-radius: 999px;
  font-family: Inter, system-ui, sans-serif;
  font-weight: 700;
  font-size: .78rem;
  letter-spacing: .06em;
  text-transform: uppercase;
  line-height: 1;
  border: 1px solid var(--border);
  background: color-mix(in oklab, var(--surface) 82%, black);
  color: rgba(233,228,222,0.85);
  box-shadow: 0 6px 16px rgba(0,0,0,.25) inset;
}

.badge--version {
  background: var(--accent);
  color: var(--accent-ink);
  border-color: color-mix(in oklab, var(--accent) 65%, black);
  box-shadow: 0 6px 16px rgba(224,178,110,0.22);
}
.badge--dev::before { content: "⚙"; font-size: .9em; }
.badge--eco::before { content: "🌐"; font-size: .9em; }

.section-intro {
  margin: .9rem 0 2rem 0;
  color: var(--text-muted);
  line-height: 1.6;
  font-family: Inter, system-ui, sans-serif;
  font-size: 1rem;
}

.code-stage {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.tabs {
	overflow: auto;
  flex: 1;
  min-width: 400px;
}
.tabs input { display: none; }

.tab-bar {
  display: inline-flex;
  gap: .45rem;
  padding: .28rem;
  background: color-mix(in oklab, var(--surface) 82%, black);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: .8rem;
}
.tab-bar label {
  font-family: Inter, system-ui, sans-serif;
  font-weight: 700;
  font-size: .95rem;
  color: rgba(233,228,222,0.75);
  padding: .5rem .85rem;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: background-color .12s ease, color .12s ease;
}
#tab-api:checked  ~ .tab-bar label[for="tab-api"],
#tab-cli:checked  ~ .tab-bar label[for="tab-cli"],
#tab-json:checked ~ .tab-bar label[for="tab-json"] {
  background: var(--accent);
  color: var(--accent-ink);
}

.tab-panels { position: relative; }
.panel { display: none; }
#tab-api:checked  ~ .tab-panels .panel:nth-child(1),
#tab-cli:checked  ~ .tab-panels .panel:nth-child(2),
#tab-json:checked ~ .tab-panels .panel:nth-child(3) { display: block; }

.code-preview {
  background: #0f0d0c;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 0.85rem 1rem 1rem;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.25);
  overflow: auto;
  min-height: 320px;
}
.win-bar {
  display: flex; align-items: center; gap: .5rem;
  height: 28px; margin-bottom: .35rem;
}
.win-bar span {
  width: 10px; height: 10px; border-radius: 50%;
  background: color-mix(in oklab, var(--surface) 78%, black);
  box-shadow: 0 0 0 1px rgba(0,0,0,.3) inset;
}
.win-bar em {
  margin-left: auto;
  font-family: Inter, system-ui, sans-serif;
  font-size: .8rem; color: rgba(233,228,222,0.7);
  font-style: normal;
}
.code-preview.terminal {
  background: linear-gradient(180deg, #13100E 0%, #0f0d0c 60%);
}
.code-preview pre {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 0.8rem; line-height: 1.6; color: #eadfce;
  white-space: pre;
}
.code-preview::-webkit-scrollbar { height: 10px; }
.code-preview::-webkit-scrollbar-thumb { background: rgba(233,228,222,0.22); border-radius: 999px; }

/* ===== Persistent Preview card ===== */
.preview {
  flex: 1;
  align-self: end;
}
.preview-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: .8rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 26px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.25) inset;
}
.preview-header {
  display: flex;
  align-items: center;
  gap: .5rem;
  margin-bottom: .5rem;
  font-family: Inter, system-ui, sans-serif;
  color: rgba(233,228,222,0.85);
  font-size: .9rem;
}
.preview-header .dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px rgba(224,178,110,0.16);
}
.preview-header .label { font-weight: 700; }
.preview-header .fps { margin-left: auto; opacity: .8; font-size: .85rem; }

.preview-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 10px;
  overflow: hidden;
  background:
    radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,.05), rgba(255,255,255,0) 60%),
    linear-gradient(180deg, #2a2320 0%, #191512 100%);
  border: 1px solid var(--border);
  box-shadow: 0 8px 18px rgba(0,0,0,.45);
}

.safe-area {
  position: absolute; inset: 6% 6%;
  border: 1px dashed rgba(233,228,222,0.18);
  border-radius: 6px;
  pointer-events: none;
}

.layer {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: Inter, system-ui, sans-serif;
  font-weight: 700; letter-spacing: .04em;
  text-transform: uppercase; font-size: .8rem;
  color: rgba(233,228,222,.75);
  mix-blend-mode: screen;
}
.layer.opening-credits {
  background:
    repeating-linear-gradient(45deg, rgba(224,178,110,.18) 0 8px, rgba(224,178,110,0) 8px 16px),
    linear-gradient(180deg, rgba(0,0,0,.3), rgba(0,0,0,.6));
}

.watermark {
  position: absolute; right: 12px; bottom: 10px;
  font-family: Inter, system-ui, sans-serif;
  font-weight: 800; letter-spacing: .06em;
  text-transform: lowercase;
  color: rgba(233,228,222,.85);
  text-shadow: 0 2px 10px rgba(0,0,0,.55);
  opacity: .9;
}

.transport {
  display: flex; align-items: center; gap: .5rem;
  margin-top: .6rem;
}
.btn-transport {
  appearance: none; border: 1px solid var(--border);
  background: color-mix(in oklab, var(--surface) 82%, black);
  color: rgba(233,228,222,.9);
  border-radius: 8px; padding: .35rem .55rem;
  font-size: .85rem; cursor: default;
}
.btn-transport.play { font-weight: 800; }
.timecode {
  margin-left: auto; font-family: Inter, system-ui, sans-serif;
  font-size: .85rem; color: rgba(233,228,222,.8);
}

.dev-features {
	display: flex;
	flex-wrap: wrap;
  gap: 1.1rem;
  margin-top: 1.4rem;
}
.card {
	flex: 1;
	min-width: 250px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.1rem 1.1rem 1rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 26px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.25) inset;
}
.card h3 {
  margin: 0 0 .6rem 0;
  font-family: Inter, Georgia, serif;
  font-weight: 800; letter-spacing: -.005em;
}
.feature-list {
  font-family: Inter, system-ui, sans-serif;
  color: var(--text-muted);
  display: grid;
  font-size: 0.8rem;
  gap: .55rem; margin: 0; padding-left: 1.2rem;
}
.feature-list li { list-style: disc; }

.github-btn {
  justify-self: start;
  margin-top: 1.5rem;
  display: inline-flex;
  align-self: start;
  align-items: center; gap: .6em;
  font-family: Inter, system-ui, sans-serif;
  font-weight: 700;
  font-size: .98rem;
  text-decoration: none;
  background: var(--accent);
  color: var(--accent-ink);
  border: 1px solid color-mix(in oklab, var(--accent) 65%, black);
  border-radius: 10px;
  padding: .7em 1.1em;
  box-shadow: 0 8px 20px rgba(224,178,110,0.20);
  transition: transform .12s ease, box-shadow .12s ease, background-color .12s ease, border-color .12s ease;
}
.github-btn:hover {
  background: #d7a761;
  border-color: color-mix(in oklab, #d7a761 65%, black);
  box-shadow: 0 10px 24px rgba(224,178,110,0.26);
  transform: translateY(-1px);
}
.github-btn sl-icon { font-size: 18px; transform: translateY(1px); }

/* responsive */
@media (max-width: 980px) {
  .preview {
  	max-width: 100%;
  	flex: 1 1 auto;
  	min-width: 400px;
  }
  .code-preview { min-height: 280px; }
  .dev-features { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
	.code-stage .tabs {
		min-width: 300px;
	}
	.preview {
		min-width: 300px;
	}
}
`

