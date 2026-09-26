
import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	min-height: 0;
	height: 100%;
	background: #0f0f0f;
	color: #cfcfcf;
}

.browser {
	display: flex;
	flex-direction: column;
	min-height: 0;
	height: 100%;
}

.browser-tabs {
	display: flex;
	height: 32px;
	gap: 0.15em;
	margin: 0.2em 0.4em;
	padding: 0.2em;
	border-radius: 7px;
	background: #191919;
}

.browser-tab {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	gap: 0.45em;
	padding: 0 0.7em;
	color: #aaa;
	background: transparent;
	border: 0;
	border-radius: 5px;
	font-size: var(--font-size-xs);
	cursor: pointer;
	transition: background 0.12s ease, color 0.12s ease;
}

.browser-tab svg {
	width: 1em;
	height: 1em;
}

.browser-tab span {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.browser-tab:hover {
	color: #e8e8e8;
	background: #222;
}

.browser-tab[data-active] {
	color: #e8e8e8;
	background: #2a2a2a;
}

.browser-body {
	display: flex;
	flex-direction: column;
	gap: 0.7em;
	min-height: 0;
	flex: 1;
	padding: 0.75em;
	overflow: auto;
	background: #0f0f0f;
}

.browser-controls {
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 0.6em;
	align-items: center;
}

.media-bin {
	display: flex;
	flex-direction: column;
	gap: 0.65em;
	--quay-surface: #161616;
	--quay-surface-hover: #222;
	--quay-surface-selected: #202020;
	--quay-border: transparent;
	--quay-text: #cfcfcf;
	--quay-muted: #858585;
	--quay-accent: #777;
	--quay-radius: 7px;
	--sl-font-size-small: var(--font-size-xs);
	--quay-browser-thumb-width: 112px;
	--quay-browser-thumb-height: 64px;
}

.media-path {
	display: flex;
	align-items: center;
	gap: 0.4em;
	color: #666;
	font-size: var(--font-size-xs);
}

.media-path button {
	padding: 0;
	color: #aaa;
	background: transparent;
	border: 0;
	font: inherit;
	cursor: pointer;
}

.media-path button:hover,
.media-path button[data-current] {
	color: #e8e8e8;
}

.media-toolbar {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto auto;
	gap: 0.4em;
	align-items: center;
}

.media-toolbar quay-searchbar,
.media-toolbar quay-filter,
.media-toolbar quay-sort {
	--quay-text: #d0d0d0;
	--sl-input-background-color: #161616;
	--sl-input-color: #d0d0d0;
	--sl-input-placeholder-color: #777;
	--sl-color-neutral-0: #161616;
	--sl-color-neutral-50: #222;
	--sl-input-border-radius-small: 7px;
	--sl-input-border-radius-medium: 7px;
}

quay-dropzone {
	display: block;
	min-height: 5em;
	border-radius: 7px;
	background: #161616;
}

quay-browser {
	min-height: 0;
	overflow: auto;
	border: 0;
	background: transparent;
}

.search {
	display: flex;
	align-items: center;
	gap: 0.5em;
	height: 32px;
	padding: 0 0.65em;
	border: 1px solid transparent;
	border-radius: 7px;
	background: #161616;
	color: #8f8f8f;
	transition: border-color 0.12s ease;
}

.search:focus-within {
	border-color: #3a3a3a;
}

.search input {
	min-width: 0;
	width: 100%;
	color: #d3d3d3;
	background: transparent;
	border: 0;
	outline: 0;
	font-family: inherit;
	font-size: var(--font-size-xs);
}

.search input::placeholder {
	color: #777;
}

.duration-control {
	display: grid;
	grid-template-columns: auto 4.8em auto;
	align-items: center;
	gap: 0.45em;
	height: 32px;
	color: #8f8f8f;
	font-size: var(--font-size-xs);
}

.duration-control input {
	min-width: 0;
	height: 100%;
	padding: 0 0.55em;
	color: #d3d3d3;
	background: #161616;
	border: 1px solid transparent;
	border-radius: 7px;
	outline: 0;
	font-family: inherit;
	font-size: var(--font-size-xs);
	transition: border-color 0.12s ease;
}

.duration-control input:focus {
	border-color: #3a3a3a;
}

.section-label {
	font-size: var(--font-size-xs);
	color: #8f8f8f;
	text-transform: uppercase;
}

.transition-grid,
.preset-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
	gap: 0.5em;
}

.transition-card,
.preset-card {
	display: flex;
	flex-direction: column;
	gap: 0.45em;
	padding: 0.45em;
	color: #cfcfcf;
	background: #1d1d1d;
	border: 1px solid #292929;
	border-radius: 4px;
	cursor: pointer;
	text-align: left;
	transition: background 0.12s ease, border-color 0.12s ease;
}

.preset-card {
	gap: 0.5em;
	padding: 0.5em;
	background: #171717;
	border-color: transparent;
	border-radius: 8px;
}

.transition-card {
	gap: 0.5em;
	padding: 0.5em;
	background: #171717;
	border-color: transparent;
	border-radius: 8px;
}

.remove-transition {
	height: 30px;
	color: #ffd7d7;
	background: #322225;
	border: 1px solid #5a2d35;
	border-radius: 6px;
	font-size: var(--font-size-xs);
	cursor: pointer;
}

.remove-transition:hover {
	background: #3b262b;
	border-color: #7a3a44;
}

.transition-card:hover,
.transition-card[data-active],
.preset-card:hover {
	border-color: transparent;
	background: #202020;
}

.transition-card[data-active] {
	border-color: color-mix(in srgb, var(--prime) 55%, #4a4a4a);
}

.preset-card:hover {
	border-color: transparent;
	background: #202020;
}

.transition-card:active {
	cursor: grabbing;
}

.transition-preview {
	position: relative;
	height: 50px;
	overflow: hidden;
	border-radius: 6px;
	background: #0b0b0b;
}

.transition-preview::before,
.transition-preview::after {
	content: "";
	position: absolute;
	inset: 0;
}

.transition-preview::before {
	clip-path: polygon(0 0, 68% 0, 36% 100%, 0 100%);
	background: linear-gradient(135deg, #2e9fff, #2543c7);
}

.transition-preview::after {
	clip-path: polygon(68% 0, 100% 0, 100% 100%, 36% 100%);
	background: linear-gradient(135deg, #ffb12e, #ff4d6d);
}

.text-preview {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 50px;
	overflow: hidden;
	border-radius: 3px;
	background: #0b0b0b;
	color: #f0f0f0;
	text-align: center;
}

.preset-card .text-preview {
	border-radius: 6px;
	background: #111;
}

.transition-name {
	color: #d8d8d8;
	font-size: var(--font-size-xs);
	font-weight: 500;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.transition-meta,
.placeholder,
.status {
	color: #8f8f8f;
	font-size: var(--font-size-xs);
}

.status {
	margin: 0;
}

.placeholder {
	margin: auto;
	text-align: center;
}

}`
