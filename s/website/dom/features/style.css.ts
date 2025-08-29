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
	background: var(--bg);
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 7rem 2vw;
	text-align: center;
	color: var(--text);
}


.features-header {
	max-width: 900px;
	margin-bottom: 3.5rem;
}

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

/* The .ai card has custom padding because its content has its own */
.feature-card.ai {
	padding: 0;
	background: transparent;
	border: none;
	box-shadow: none;
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
	width: 40px;
	height: 40px;
	display: grid;
	place-items: center;
	border-radius: 10px;
	background-color: rgba(233,228,222,0.05);
	border: 1px solid var(--border);
}

.card-icon svg {
	width: 24px;
	height: 24px;
	fill: var(--text-muted);
	transition: fill .2s ease;
}

.feature-card:hover .card-icon svg {
	fill: var(--accent);
}

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
	display: grid;
	place-items: center;
	width: 100%;
	min-height: 120px;
	margin-top: auto;
	padding: 1rem;
}

#animation-skeleton sl-icon {
	font-size: 150px;
}

/* ===== Grid Spans ===== */
.ai { grid-column: span 12; }
.animations, .filters { grid-column: span 6; }
.transitions { grid-column: span 12; }
.fonts, .export, .files { grid-column: span 4; }

/* ===== Transitions Card ===== */
.transitions {
	height: 400px;
	padding: 0;
}

.transitions .box {
	display: flex;
	flex-direction: column;
	position: absolute;
	padding: 1em;
}

.transitions p {
	text-align: left;
}

.transitions video {
	height: 100%;
	width: 100%;
}

/* ===== AI Splash Panel ===== */
.ai-splash {
	color: var(--text);
	background: var(--card);
	border: 1px solid var(--border);
	border-radius: 16px;
	padding: 1.5rem;
	box-shadow: 0 10px 26px rgba(0,0,0,.55);
	backdrop-filter: blur(10px);
}

.ai-head {
	display: flex;
	gap: .5rem;
	flex-wrap: wrap;
	margin-bottom: 1rem;
}

.chip {
	border: 1px solid var(--border);
	background: color-mix(in oklab, var(--surface) 82%, black);
	color: rgba(233,228,222,.9);
	font: 700 .72rem/1 Inter,system-ui,sans-serif;
	letter-spacing: .06em;
	text-transform: uppercase;
	border-radius: 8px;
	padding: .28rem .6rem;
}

.chip-green {
	background: rgba(56,199,130,.15);
	border-color: rgba(56,199,130,.35);
	color: #b5f0d4;
}

.ai-title {
	margin: .1rem 0 .2rem;
	font: 800 clamp(1.25rem, .9rem + 1.4vw, 1.6rem)/1.2 Inter,Georgia,serif;
	letter-spacing: -.01em;
}

.ai-sub {
	display: block;
	margin-top: .3rem;
	color: var(--text-muted);
	font: 500 1rem/1.5 Inter,system-ui,sans-serif;
}

.ai-body {
	display: flex;
	gap: 1.5rem;
	align-items: center;
	flex-wrap: wrap;
}

.logo-row {
	display: flex;
	gap: 0.5em;
	flex-wrap: wrap;
	margin: .6rem 0 1rem;
	align-items: center;
}

.logo {
	display: inline-flex;
	align-items: center;
	gap: .4rem;
	border: 1px solid var(--border);
	border-radius: 10px;
	padding: .35rem .6rem;
	color: rgba(233,228,222,.9);
	background: color-mix(in oklab, #1B1816 82%, black);
	font: 700 .8rem/1 Inter,system-ui,sans-serif;
}

.logo.badge svg {
	width: 13px;
	height: 13px;
	display: block;
	color: var(--accent);
}

.logo.badge strong {
	font-weight: 800;
}

.bullets {
	text-align: left;
	margin: 0 0 1.25rem 1.25rem;
	padding: 0;
	color: var(--text-muted);
	display: grid;
	gap: 1rem;
	font: 500 .95rem/1.55 Inter,system-ui,sans-serif;
}

.bullets li {
	list-style: disc;
}

.cta-row {
	display: flex;
	gap: .8rem;
	flex-wrap: wrap;
	font-size: 0.8rem;
}

.cta-btn::part(base) {
	font-family: Inter, system-ui, sans-serif;
	font-weight: 800;
	width: 200px;
	letter-spacing: .01em;
	border-radius: 10px;
	padding: .8rem 1.1rem;
	box-shadow: 0 8px 20px rgba(224,178,110,0.20);
}

.cta-btn:not(.secondary)::part(base) {
	background: var(--accent);
	color: var(--accent-ink);
	border: 1px solid color-mix(in oklab, var(--accent) 65%, black);
}

.cta-btn:not(.secondary):hover::part(base) {
	background: #d7a761;
	border-color: color-mix(in oklab, #d7a761 65%, black);
	transform: translateY(-1px);
	box-shadow: 0 10px 24px rgba(224,178,110,0.26);
}

.cta-btn.secondary::part(base) {
	background: transparent;
	color: var(--text);
	border: 1px solid var(--border);
	box-shadow: none;
}

.cta-btn.secondary:hover::part(base) {
	background: var(--card-hover);
}

.big-logo {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2.5em;
	color: var(--accent);
	margin-bottom: auto;
	flex: 1;
}

.big-logo .flex {
	display: flex;
	gap: 3em;
}

.big-logo .logo-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5em;
}

.big-logo .logo-ai {
	font-size: 3em;
	width: 60px;
	height: 60px;
}

.big-logo img {
	width: 60px;
	height: 60px;
}

.big-logo svg {
	width: 120px;
	height: 120px;
}

.big-logo span {
	font: 800 1rem/1.2 Inter,system-ui,sans-serif;
	color: var(--text-muted);
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
	.feature-grid {
		grid-template-columns: repeat(8, 1fr);
	}
	.ai, .animations, .filters, .transitions {
		grid-column: span 8;
	}
	.fonts, .export, .files {
		grid-column: span 4;
	}
}

@media (max-width: 900px) {
	.ai-body .right {
		display: none;
	}
}

@media (max-width: 720px) {
	:host {
		padding: 5rem 1rem;
	}
	.feature-grid {
		grid-template-columns: 1fr;
		gap: 1.25rem;
	}
	.ai, .animations, .filters, .transitions, .fonts, .export, .files {
		grid-column: span 1;
	}
	.transitions {
		grid-template-columns: 1fr;
	}
	.transitions .card-visual {
		order: -1;
	}
	.feature-card {
		padding: 1.35rem;
	}
}

/* ===== Keyframes ===== */
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
`
