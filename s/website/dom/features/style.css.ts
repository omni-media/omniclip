import {css} from "@benev/slate"

export default css`
:host {
  --bg: #141110;
  --surface: #1B1816;
  --text: #E9E4DE;
  --text-muted: #CFC9C2;
  --border: rgba(233,228,222,0.12);
  --card: rgba(233,228,222,0.06);
  --card-hover: rgba(233,228,222,0.1);
  --shadow: rgba(0,0,0,0.55);
  --accent: #E0B26E;
  --accent-ink: #1a1613;
  --glow: rgba(224,178,110,0.2);
}

/* ===== Section ===== */
.features {
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 7rem 2vw;
  text-align: center;
  color: var(--text);
}

.features-header { max-width: 900px; margin-bottom: 3.5rem; }
.features-header h2 {
  font-family: Inter, Georgia, serif;
  font-weight: 800;
  font-size: clamp(2rem, 1.25rem + 3vw, 3rem);
  letter-spacing: -0.01em;
  margin: 0 0 .35rem 0;
  color: var(--text);
}
.features-header p {
  margin: 0;
  color: var(--text-muted);
  font-family: Inter, system-ui, sans-serif;
  font-size: 1.1rem;
  letter-spacing: .01em;
  max-width: 50ch;
  margin-inline: auto;
}

/* ===== Grid ===== */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
  max-width: 1000px;
}
.feature-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: 18px;
  background: var(--card);
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 26px var(--shadow);
  transition: all .2s ease;
  text-align: left;
  overflow: hidden;
}

/* ===== Default card bits ===== */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}
.card-icon {
  flex-shrink: 0;
  width: 40px; height: 40px;
  display: grid; place-items: center;
  border-radius: 10px;
  background-color: rgba(233,228,222,0.05);
  border: 1px solid var(--border);
}
.card-icon svg { width: 24px; height: 24px; fill: var(--text-muted); transition: fill .2s ease; }
.feature-card:hover .card-icon svg { fill: var(--accent); }

.feature-card h3 {
  font-family: Inter, Georgia, serif;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.005em;
  margin: 0;
  color: var(--text);
}
.feature-card p {
  font-size: .90rem;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0;
  flex-grow: 1;
  text-align: left;
  font-family: system-ui;
}

.card-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.card-visual video {
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
}

/* ===== Animation Showcase ===== */
.animation-demo-container {
  display: grid; place-items: center;
  width: 100%; min-height: 120px;
  margin-top: auto; padding: 1rem;
}
#animation-skeleton sl-icon { font-size: 150px; }

/* Keyframes */
@keyframes fadeInDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
.fade-in-down{animation:fadeInDown .8s ease forwards}
@keyframes slideInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
.slide-in-up{animation:slideInUp .8s ease-out forwards}
@keyframes bounceIn { 0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(.9)}100%{transform:scale(1)} }
.bounce-in{animation:bounceIn 1s ease forwards}
@keyframes zoomIn { from{opacity:0;transform:scale(.5)} to{opacity:1;transform:scale(1)} }
.zoom-in{animation:zoomIn .7s ease-out forwards}
@keyframes tada { from{transform:scale(1)}10%,20%{transform:scale(.9) rotate(-3deg)}30%,50%,70%,90%{transform:scale(1.1) rotate(3deg)}40%,60%,80%{transform:scale(1.1) rotate(-3deg)}to{transform:scale(1) rotate(0)} }
.tada{animation:tada 1s ease forwards}
@keyframes blurIn { from{opacity:0;filter:blur(10px)} to{opacity:1;filter:blur(0)} }
.blur-in{animation:blurIn 1s ease-out forwards}
@keyframes pulse { from{transform:scale(1)}50%{transform:scale(1.05)}to{transform:scale(1)} }
.pulse{animation:pulse 1.2s ease-in-out forwards}

/* ===== Spans ===== */
.ai { grid-column: span 12; }        /* full width carousel */
.animations, .filters { grid-column: span 6; }
.transitions { grid-column: span 12; }
.fonts, .export, .files { grid-column: span 4; }

/* Transitions layout card (your existing one) */
.transitions {
	height: 400px;
	padding: 0;

	& .box {
		display: flex;
		flex-direction: column;
		position: absolute;
		padding: 1em;
	}

	p {
		text-align: left;
	}

	& video {
		height: 100%;
		width: 100%;
	}
}

/* ===== Shoelace carousel tweaks ===== */
sl-carousel {
  width: 100%;
  --aspect-ratio: auto;
  --carousel-nav-color: var(--text);
  --carousel-pagination-color: var(--accent);
  --carousel-pagination-color-active: var(--accent);
}
sl-carousel::part(base) {
  border-radius: 12px;
  overflow: hidden;
}
sl-carousel-item {
  display: flex;
  justify-content: center;
	width: 100%;
	height: 100%;
}

/* ===== AI Splash (shared) ===== */
.ai-splash{
  color:var(--text);
  background:var(--card);
  border:1px solid var(--border);
  border-radius:16px;
  padding:1.5rem;
  box-shadow:0 10px 26px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,0.25) inset;
  backdrop-filter:blur(10px);
	width: 98%;
	height: 100%;
}

sl-spinner {
	--indicator-color: var(--accent);
}

.speech-to-text .stt-box {
	display: flex;
	gap: 1em;
	height: 100%;

	.box {
		display: flex;
		flex-direction: column;
		gap: 1em;
		height: 100%;
		flex: 2;

		.stt-output {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 200px;
			position: relative;

			span {
				position: absolute;
				top: 0;
				left: 0;
				padding: 1em;
    		font-family: Inter, system-ui, sans-serif;
    		font-size: 0.8rem;
    		color: rgba(233, 228, 222, 0.7);
    		font-style: normal;
			}

			sl-spinner {
				font-size: 3rem;
			}
		}
	}
}

.bg-remover .box {
	display: flex;
	gap: 0.5em;

	sl-image-comparer {
		flex: 1.5;
		overflow: hidden;
		border-radius: 10px;
		width: 400px;
		height: 250px;

		img {
			width: 100%;
			height: 250px;
		}
	}

	.stt-models {
		flex: 1;
	}
}

.ai-head{ display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:1rem; }
.chip{
  border:1px solid var(--border);
  background:color-mix(in oklab, var(--surface) 82%, black);
  color:rgba(233,228,222,.9);
  font:700 .72rem/1 Inter,system-ui,sans-serif;
  letter-spacing:.06em; text-transform:uppercase;
  border-radius:8px; padding:.28rem .6rem;
}
.chip-green{ background:rgba(56,199,130,.15); border-color:rgba(56,199,130,.35); color:#b5f0d4; }

.ai-title{ margin:.1rem 0 .2rem; font:800 clamp(1.25rem, .9rem + 1.4vw, 1.6rem)/1.2 Inter,Georgia,serif; letter-spacing:-.01em; }
.ai-sub{ display:block; margin-top:.3rem; color:var(--text-muted); font:500 1rem/1.5 Inter,system-ui,sans-serif; }

.ai-body{
  display:grid; grid-template-columns:1.05fr .95fr; gap:1.5rem; align-items:center;
}
.logo-row{
  display:flex; gap:0.5em; flex-wrap:wrap; margin:.6rem 0 1rem; align-items:center;
}
.logo{
  display:inline-flex; align-items:center; gap:.4rem;
  border:1px solid var(--border); border-radius:10px;
  padding:.35rem .6rem; color:rgba(233,228,222,.9);
  background:color-mix(in oklab, #1B1816 82%, black);
  font:700 .8rem/1 Inter,system-ui,sans-serif;
}
.logo.badge svg{ width:13px; height:13px; display:block; color:var(--accent); }
.logo.badge strong{ font-weight:800; }

.bullets{ text-align:left; margin:0 0 1.25rem 1.25rem; padding:0; color:var(--text-muted); display:grid; gap: 1rem; font:500 .95rem/1.55 Inter,system-ui,sans-serif; }
.bullets li{ list-style:disc; }
/* CTA Buttons (Shoelace) */
.cta-row{ display:flex; gap:.8rem; flex-wrap:wrap; font-size: 0.8rem;}
.cta-btn::part(base){
  font-family: Inter, system-ui, sans-serif;
  font-weight: 800;
  letter-spacing: .01em;
  border-radius: 10px;
  padding: .8rem 1.1rem;
  box-shadow: 0 8px 20px rgba(224,178,110,0.20);
}
.cta-btn:not(.secondary)::part(base){
  background: var(--accent);
  color: var(--accent-ink);
  border: 1px solid color-mix(in oklab, var(--accent) 65%, black);
}
.cta-btn:not(.secondary):hover::part(base){
  background: #d7a761;
  border-color: color-mix(in oklab, #d7a761 65%, black);
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(224,178,110,0.26);
}
.cta-btn.secondary::part(base){
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: none;
}
.cta-btn.secondary:hover::part(base){
  background: var(--card-hover);
}

/* Right logo panel on splash */
.big-logo{
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:2.5em; color:var(--accent);
	margin-bottom: auto;

	.flex {
		display: flex;
		gap: 3em;
	}

	.logo-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5em;
	}

	.logo-ai {
		font-size: 3em;
		width: 60px;
		height: 60px;
	}

	img {
		width: 60px;
		height: 60px;
	}
}
.big-logo svg{ width:120px; height:120px; }
.big-logo span{ font:800 1rem/1.2 Inter,system-ui,sans-serif; color:var(--text-muted); }

/* ===== Speech-to-Text UI ===== */
.stt-ui {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* Upload row */
.stt-upload {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}
.stt-upload sl-input::part(base){
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
}
.stt-upload sl-input::part(form-control-label){
  color: var(--text-muted);
}
.stt-upload sl-checkbox::part(control){
  border-color: var(--border);
	width: 1em;
	height: 1em;
	border: 1px solid;
}
.stt-upload sl-checkbox::part(control--checked){
  background: var(--accent);
  border-color: color-mix(in oklab, var(--accent) 65%, black);
}
.stt-upload sl-checkbox::part(label){
  color: var(--text-muted);
  font-weight: 600;
}

sl-checkbox::part(checked-icon) {
	width: 1em;
	height: 1em;
}

/* Models loading box */
.stt-models {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: .8rem 1rem;
	flex: 1;
}
.stt-label {
  font: 700 .85rem Inter, system-ui, sans-serif;
  color: var(--accent);
}
.stt-models ul {
  margin: .5rem 0 0;
  padding-left: 1.2rem;
  font: .9rem Inter, system-ui, sans-serif;
  color: var(--text-muted);
  display: grid;
  gap: .4rem;
}
.stt-models li {
  list-style: disc;
  display: flex;
  align-items: center;
  gap: .5rem;
}
.stt-models sl-spinner {
  width: 14px;
  height: 14px;
}

/* Progress */
.stt-progress {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}
sl-progress-bar::part(base) { height: 10px; border-radius: 6px; background: rgba(233,228,222,0.12); }
sl-progress-bar::part(indicator) { background: var(--accent); }

/* Output */
.stt-output {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: .8rem 1rem;
  font: .9rem Inter, system-ui, sans-serif;
}
.stt-output .tag {
  background: var(--accent);
  color: var(--accent-ink);
  font: 800 .7rem Inter, system-ui, sans-serif;
  border-radius: 6px;
  padding: .2rem .5rem;
  margin-bottom: .5rem;
  display: inline-block;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.stt-output pre {
  margin: 0;
  white-space: pre-wrap;
  color: var(--text);
  font: 500 .9rem/1.4 Inter, system-ui, sans-serif;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .feature-grid { grid-template-columns: repeat(8, 1fr); }
  .ai, .animations, .filters, .transitions { grid-column: span 8; }
  .fonts, .export, .files { grid-column: span 4; }
}
@media (max-width: 900px){
  .ai-body{ grid-template-columns:1fr; }
  .big-logo{ margin-top:1.25rem; }
}
@media (max-width: 720px) {
  .features { padding: 5rem 1rem; }
  .feature-grid { grid-template-columns: 1fr; gap: 1.25rem; }
  .ai, .animations, .filters, .transitions,
  .fonts, .export, .files { grid-column: span 1; }
  .transitions { grid-template-columns: 1fr; }
  .transitions .card-visual { order: -1; }
  .feature-card { padding: 1.35rem; }
}
`

