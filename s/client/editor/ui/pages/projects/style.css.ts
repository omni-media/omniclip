import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex: 1;
	min-height: 0;
	--accent: #c4c8cd;
	--border: #ffffff0a;
	--surface: #161616;
	--muted: #858585;
	color: #d0d0d0;
	background: #0f0f0f;
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	text-shadow: none;
}

.project-hub {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 0;
	overflow: auto;
	background: #0f0f0f;
}

button, input, select { font: inherit; }
button { color: inherit; border: 0; cursor: pointer; }
button, a, .project-card {
	transition: background 140ms ease, color 140ms ease, border-color 140ms ease;
}
button:focus-visible, input:focus-visible, select:focus-visible {
	outline: 1px solid var(--accent);
	outline-offset: 2px;
}

.topbar {
	position: sticky;
	top: 0;
	z-index: 5;
	display: grid;
	grid-template-columns: minmax(190px, 1fr) minmax(240px, 430px) minmax(290px, 1fr);
	align-items: center;
	gap: 1em;
	min-height: 58px;
	padding: 0.55em max(1em, calc((100% - 1200px) / 2));
	padding-left: max(3.25em, calc((100% - 1200px) / 2));
	border-bottom: 1px solid var(--border);
	background: #0f0f0f;
}

.brand, .controls, .library-controls, .featured-actions,
.featured-meta, .metadata {
	display: flex;
	align-items: center;
}

.brand {
	gap: 0.65em;
	width: max-content;
	color: inherit;
	text-decoration: none;
}
.brand:hover { text-decoration: none; }
.logo-mark { width: 30px; height: 30px; object-fit: contain; }
.brand-copy {
	display: grid;
	gap: 0.18em;
	line-height: 1;

	strong {
		color: #ddd;
		font-size: var(--font-size-m);
		font-weight: 500;
		letter-spacing: -0.02em;
	}
}

.search, .sort, .view-toggle, .topbar-button {
	border: 1px solid transparent;
	background: var(--surface);
}

.search {
	display: flex;
	align-items: center;
	height: 34px;
	padding: 0 0.8em;
	border-radius: 7px;
	background: var(--surface);
	color: #858585;

	span {
		width: 0.82em;
		height: 0.82em;
		margin-right: 0.6em;
		border: 1px solid currentColor;
		border-radius: 50%;

		&::after {
			content: "";
			display: block;
			width: 0.38em;
			height: 1px;
			margin: 0.66em 0 0 0.57em;
			background: currentColor;
			transform: rotate(45deg);
		}
	}

	input {
		min-width: 0;
		width: 100%;
		height: 100%;
		color: #ececee;
		background: transparent;
		border: 0;
		outline: 0;
		font-size: var(--font-size-xs);
	}

	input::placeholder { color: #696c71; }
}
.search:focus-within { border-color: #454545; }

.controls, .library-controls { justify-content: end; gap: 0.45em; }
.topbar-button, .hero-button, .drawer-actions button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.45em;
	height: 34px;
	padding: 0 0.85em;
	border-radius: 7px;
	font-size: var(--font-size-xs);
	font-weight: 500;
	white-space: nowrap;

	span { line-height: 1; }
}

.topbar-button:hover, .hero-button:hover,
.drawer-actions button:hover { background: #ffffff12; }
.topbar-button.primary, .hero-button.primary, .drawer-actions .primary {
	color: #202020;
	border-color: transparent;
	background: #dedede;
}
.topbar-button.primary:hover, .hero-button.primary:hover, .drawer-actions .primary:hover {
	background: #eee;
}
:is(.topbar-button, .hero-button, .drawer-actions button) svg {
	display: block;
	flex: 0 0 auto;
	width: 1em;
	height: 1em;
	fill: currentColor;
}

.hub-content {
	width: min(100%, 1232px);
	margin: 0 auto;
	padding: 2em 1.5em;
}

.featured-project {
	display: grid;
	grid-template-columns: minmax(180px, 32%) minmax(0, 1fr);
	align-items: center;
	gap: 1.75em;
	padding: 1em;
	overflow: hidden;
	border-radius: 10px;
	background: #131313;
}
.featured-thumbnail {
	display: block;
	width: 100%;
	aspect-ratio: 16 / 9;
	object-fit: cover;
	border-radius: 7px;
	background: #111;
}

.featured-copy {
	min-width: 0;
	padding: 0.5em 0.5em 0.5em 0;

	h1 {
		margin-top: 0.18em;
		color: #e7e7e7;
		font-size: clamp(1.1rem, 2.2vw, 1.6rem);
		font-weight: 500;
		letter-spacing: -0.025em;
		line-height: 1.3;
		overflow-wrap: anywhere;
	}

	p {
		margin-top: 0.5em;
		color: var(--muted);
		font-size: var(--font-size-xs);
		line-height: 1.5;
	}
}

.eyebrow {
	display: block;
	color: var(--muted);
	font-size: calc(var(--font-size-xs) - 1px);
	font-weight: 500;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}
.featured-meta, .metadata { flex-wrap: wrap; }
.featured-meta {
	gap: 0.5em;
	margin-top: 0.9em;
	color: #a8aaae;
	font-size: var(--font-size-xs);
}
.featured-meta span:not(:last-child)::after,
.metadata span:not(:last-child)::after {
	content: "•";
	margin-left: 0.5em;
	color: #55585e;
}
.featured-actions { gap: 0.55em; margin-top: 1.25em; }
.hero-button {
	border: 1px solid transparent;
	background: #1c1c1c;
	color: #f0f0f1;
	text-shadow: none;
}

.project-library { margin-top: 2.35em; }
.section-header {
	display: flex;
	align-items: end;
	justify-content: space-between;
	gap: 1em;
	margin-bottom: 1em;
}
.section-heading h2 {
	margin-top: 0.25em;
	color: #f0f0f1;
	font-size: var(--font-size-l);
	font-weight: 500;
	letter-spacing: -0.025em;

	small {
		margin-left: 0.35em;
		color: #6f7277;
		font-size: var(--font-size-xs);
		font-weight: 600;
		vertical-align: middle;
	}
}

.sort, .view-toggle { height: 32px; border-radius: 7px; }
.sort {
	display: flex;
	align-items: center;
	gap: 0.4em;
	padding: 0 0.7em;
	color: var(--muted);
	font-size: var(--font-size-xs);

	select { color: #cfd0d2; background: transparent; border: 0; outline: 0; }
	option { color: #ddd; background: #161616; }
}
.view-toggle {
	display: grid;
	grid-template-columns: 1fr 1fr;
	overflow: hidden;
	padding: 3px;

	button {
		display: grid;
		place-items: center;
		min-width: 34px;
		background: transparent;
		color: var(--muted);
		border-radius: 5px;
	}
	button:hover, button[data-active] { color: #eee; background: #242424; }
}

.project-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1.1em 0.85em;
}
.project-card {
	min-width: 0;
	padding: 0.35em;
	border: 1px solid transparent;
	border-radius: 9px;
	background: #131313;
	cursor: pointer;
}
.project-card:hover { border-color: transparent; background: #191919; }
.thumbnail {
	position: relative;
	aspect-ratio: 16 / 9;
	overflow: hidden;
	border: 0;
	border-radius: 8px;
	background: #111 center / cover;
}
.thumbnail::after {
	content: "";
	position: absolute;
	inset: 0;
	background: linear-gradient(transparent 45%, #000b);
}
.duration, .overflow {
	position: absolute;
	top: 0.5em;
	z-index: 1;
	border: 0;
	border-radius: 5px;
	background: #111d;
	backdrop-filter: blur(8px);
}
.duration {
	left: 0.55em;
	padding: 0.18em 0.45em;
	color: #d7d8da;
	font-size: calc(var(--font-size-xs) - 1px);
}
.overflow {
	right: 0.45em;
	display: grid;
	place-items: center;
	width: 28px;
	height: 26px;
	color: #d1d2d4;
	font-size: var(--font-size-m);
	letter-spacing: 1px;
}
.overflow:hover { background: #242424; }

.project-body { padding: 0.7em 0.2em 0.15em; }
.project-title {
	display: flex;
	align-items: center;
	gap: 0.4em;
	min-width: 0;

	h2 {
		overflow: hidden;
		color: #e8e8e9;
		font-size: var(--font-size-s);
	font-weight: 500;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.favorite {
	display: grid;
	place-items: center;
	color: var(--accent);

	svg { width: 1em; height: 1em; fill: currentColor; }
}
.metadata {
	gap: 0.35em;
	margin-top: 0.38em;
	color: var(--muted);
	font-size: calc(var(--font-size-xs) - 1px);
}
.metadata span:not(:last-child)::after { margin-left: 0.35em; }
.edited { margin-top: 0.3em; color: #64676c; font-size: calc(var(--font-size-xs) - 1px); }

.timeline-strip {
	display: flex;
	align-items: end;
	gap: 2px;
	height: 22px;
	margin-top: 0.6em;
	padding: 3px;
	overflow: hidden;
	border: 1px solid #ffffff0c;
	border-radius: 4px;
	background: #ffffff04;
}
.timeline-strip::after {
	content: "";
	flex: 1 0 24px;
	height: 4px;
	background: #292b2f;
}
.clip { display: block; height: 100%; min-width: 7px; border-radius: 1px; opacity: 0.85; }
.clip-0 { background: #50545a; }
.clip-1 { background: #60646a; }
.clip-2 { background: #45494e; }
.clip-3 { background: #70747a; }

.project-grid.list {
	grid-template-columns: 1fr;
	gap: 0.35em;

	.project-card {
		display: grid;
		grid-template-columns: 180px minmax(0, 1fr);
		align-items: center;
		gap: 0.8em;
		padding: 0.45em;
	}
	.project-body { padding: 0.2em 0.6em 0.2em 0; }
	.timeline-strip { max-width: 440px; }
}

.empty-state {
	display: grid;
	place-items: center;
	align-content: center;
	gap: 0.5em;
	min-height: 260px;
	padding: 2em;
	border: 1px dashed #ffffff16;
	border-radius: 10px;
	color: #777a80;
	text-align: center;

	h2 { color: #e7e7e8; font-size: var(--font-size-l); font-weight: 650; }
	p { font-size: var(--font-size-xs); }
}

.drawer-layer {
	position: fixed;
	inset: 0;
	z-index: 20;
	display: flex;
	justify-content: end;
	background: #000a;
}
.details-drawer {
	width: min(420px, 100%);
	height: 100%;
	overflow: auto;
	padding: 1em;
	border-left: 1px solid var(--border);
	background: #111;
	box-shadow: -18px 0 46px #0009;

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75em;
	}
	header h2 { color: #ececee; font-size: var(--font-size-m); font-weight: 600; }
}
.close {
	display: grid;
	place-items: center;
	width: 30px;
	height: 30px;
	border-radius: 7px;
	background: var(--surface);
	color: #aaa;
	font-size: var(--font-size-l);
}
.close:hover { color: white; background: #ffffff12; }
.drawer-thumbnail {
	aspect-ratio: 16 / 9;
	border: 1px solid var(--border);
	border-radius: 9px;
	background-position: center;
	background-size: cover;
}
.drawer-summary {
	margin-top: 1em;

	h3 { color: #eee; font-size: var(--font-size-l); font-weight: 500; overflow-wrap: anywhere; }
	p { margin-top: 0.45em; color: #8e9196; font-size: var(--font-size-xs); line-height: 1.5; }
}
.drawer-stats {
	display: grid;
	gap: 0.55em;
	margin-top: 1em;
	padding: 1em 0;
	border-block: 1px solid #ffffff0d;

	div {
		display: grid;
		grid-template-columns: 7em minmax(0, 1fr);
		gap: 0.75em;
		font-size: var(--font-size-xs);
	}
	span { color: var(--muted); }
	strong {
		overflow: hidden;
		color: #d8d9db;
		font-weight: 500;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.drawer-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.45em;
	margin-top: 0.85em;

	span {
		padding: 0.3em 0.55em;
		border: 1px solid var(--border);
		border-radius: 5px;
		background: var(--surface);
		color: #bfc0c3;
		font-size: var(--font-size-xs);
	}
}
.drawer-actions {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.5em;
	margin-top: 1em;

	button {
		border: 1px solid var(--border);
		border-radius: 6px;
		background: var(--surface);
		color: #cfd0d2;
	}
	.danger { color: #ff9b9b; }
}

@media (max-width: 1050px) {
	.topbar { grid-template-columns: auto minmax(220px, 1fr) auto; }
	.topbar-button:not(.primary) span { display: none; }
	.project-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 760px) {
	.hub-content { padding: 0.75em 0.65em 1em; }

	.featured-project { grid-template-columns: minmax(120px, 32%) minmax(0, 1fr); gap: 1em; }
	.section-header { align-items: stretch; flex-direction: column; }
	.library-controls { justify-content: space-between; }
	.project-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	.project-grid.list .project-card { grid-template-columns: 120px minmax(0, 1fr); }
}

@media (max-width: 560px) {
	.topbar {
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: 0.5em;
		padding: 0.65em;
		padding-left: 3.25em;
		background: #0f0f0f;
	}
	.topbar-button.primary {
		width: 34px;
		padding: 0;
	}
	.topbar-button.primary span { display: none; }
}

@media (max-width: 480px) {
	.featured-project { grid-template-columns: 1fr; }
	.featured-copy { padding: 0.5em; }
	.project-grid { grid-template-columns: 1fr; }
	.project-grid.list .project-card { grid-template-columns: 105px minmax(0, 1fr); }
	.featured-meta span:last-child { display: none; }
}

}`
