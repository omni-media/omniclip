import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	min-height: 0;
	height: 100%;
	background: #151515;
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
	height: 36px;
	gap: 0.2em;
	padding: 0.2em;
	border-bottom: 1px solid #101010;
	background: #1d1d1d;
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
	border-radius: 0.25em;
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
	background: #333;
}

.browser-tab[data-active] {
	color: #e8e8e8;
	background: #3f3f3f;
}

.browser-body {
	display: flex;
	flex-direction: column;
	gap: 0.7em;
	min-height: 0;
	flex: 1;
	padding: 0.75em;
	overflow: auto;
	background: #151515;
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
}

.media-toolbar {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto auto;
	gap: 0.4em;
	align-items: center;
}

quay-dropzone {
	min-height: 5em;
}

quay-browser {
	min-height: 0;
	overflow: auto;
	border: 1px solid #252a2f;
	border-radius: 6px;
	background: #181c20;
}

.search {
	display: flex;
	align-items: center;
	gap: 0.5em;
	height: 32px;
	padding: 0 0.65em;
	border: 1px solid #2b2b2b;
	border-radius: 3px;
	background: #1f1f1f;
	color: #8f8f8f;
}

.search input {
	min-width: 0;
	width: 100%;
	color: #d3d3d3;
	background: transparent;
	border: 0;
	outline: 0;
	font-size: var(--font-size-xs);
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
	background: #1f1f1f;
	border: 1px solid #2b2b2b;
	border-radius: 3px;
	font-size: var(--font-size-xs);
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
	border-color: #4a4a4a;
	background: #242424;
}

.transition-card[data-active] {
	border-color: color-mix(in srgb, var(--prime) 55%, #4a4a4a);
}

.transition-preview {
	position: relative;
	height: 50px;
	overflow: hidden;
	border-radius: 3px;
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

