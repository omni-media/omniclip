
import {css} from "lit"

export default css`
:host {
	display: flex;
	height: 100vh;
	justify-content: center;
	flex-direction: column;
}

.top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 5em;
}

.site-name {
	font-family: "IBM Plex Mono", ui-monospace, monospace;
	font-size: var(--font-size-s);
	color: #555;
	letter-spacing: 0.05em;
}

.site-name span {
	color: #e8a020;
}

.top-links {
	display: flex;
	align-items: center;
	gap: 1.5em;
	font-family: "IBM Plex Mono", ui-monospace, monospace;
	font-size: var(--font-size-xs);
}

.top-links a {
	color: #555;
	text-decoration: none;
	transition: color 0.2s;
}

.top-links a:hover {
	color: #ccc;
	text-decoration: none;
}

.menu-button {
	display: none;
	width: 1.8em;
	height: 1.8em;
	padding: 0;
	border: 0;
	background: transparent;
	cursor: pointer;
	opacity: 0.75;
	transition: opacity 0.2s;
}

.menu-button:hover {
	opacity: 1;
}

.menu-button img {
	display: block;
	width: 100%;
	height: 100%;
}

sl-drawer::part(base) {
	z-index: 100;
}

sl-drawer::part(overlay) {
	background: rgb(0 0 0 / 0.55);
	backdrop-filter: blur(0.5em);
}

sl-drawer::part(panel) {
	border-bottom: 1px solid #1d1d1d;
	background: #111;
	color: #ccc;
}

sl-drawer::part(header) {
	border-bottom: 1px solid #1d1d1d;
	padding: 1em;
}

sl-drawer::part(title) {
	color: #777;
	font-family: "IBM Plex Mono", ui-monospace, monospace;
	font-size: var(--font-size-xs);
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

sl-drawer::part(close-button) {
	color: #777;
}

sl-drawer::part(body) {
	padding: 0.75em;
}

sl-drawer::part(footer) {
	border-top: 1px solid #1d1d1d;
	padding: 0.75em;
}

.drawer-links {
	display: flex;
	flex-direction: column;
	gap: 0.4em;
}

.drawer-links a {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border: 1px solid #1d1d1d;
	background: #161616;
	padding: 1em 1.2em;
	color: #ccc;
	font-family: "IBM Plex Mono", ui-monospace, monospace;
	font-size: var(--font-size-xs);
	text-decoration: none;
	transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.drawer-links a::after {
	content: "->";
	color: #555;
}

.drawer-links a:hover {
	border-color: #2a2a2a;
	background: #181818;
	color: #e8a020;
	text-decoration: none;
}

.drawer-primary::part(base) {
	border: 0;
	background: #e8a020;
	color: #111;
	font-family: "IBM Plex Mono", ui-monospace, monospace;
	font-size: var(--font-size-xs);
}

h1 {
	margin-bottom: 0.5em;
	color: #eee;
	font-family: "IBM Plex Mono", ui-monospace, monospace;
	font-size: clamp(1.6em, 5.5vw, 2.5em);
	font-weight: 400;
	line-height: 1.2;
	letter-spacing: 0;
}

.intro {
	max-width: 32em;
	margin-bottom: 2em;
	color: #777;
	font-size: calc(var(--font-size-m) - 1px);
}

.cta-row {
	display: flex;
	align-items: center;
	gap: 1.3em;
	margin-bottom: 5em;
}

.btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: #e8a020;
	color: #111;
	padding: 0.6em 1.4em;
	font-family: "IBM Plex Mono", ui-monospace, monospace;
	font-size: calc(var(--font-size-s) - 1px);
	line-height: 1.2;
	text-decoration: none;
	white-space: nowrap;
	transition: opacity 0.15s;
}

.btn:hover {
	opacity: 0.85;
	text-decoration: none;
}

.btn-plain {
	color: #444;
	font-family: "IBM Plex Mono", ui-monospace, monospace;
	font-size: calc(var(--font-size-s) - 1px);
	text-decoration: none;
	transition: color 0.2s;
}

.btn-plain:hover {
	color: #999;
	text-decoration: none;
}

@media (max-width: 500px) {
	.top {
		align-items: center;
		flex-direction: row;
		margin-bottom: 3.5em;
	}

	.top-links {
		display: none;
	}

	.menu-button {
		display: block;
	}

	.cta-row {
		align-items: flex-start;
		flex-direction: column;
		gap: 0.9em;
	}
}
`

