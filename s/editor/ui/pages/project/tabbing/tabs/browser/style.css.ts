import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	min-height: 0;
	height: 100%;
	background: #151819;
	color: #c9d0d8;
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
	border-bottom: 1px solid #252a2f;
	background: #1b1f22;
}

.browser-tab {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	gap: 0.45em;
	padding: 0 1em;
	color: #8e96a6;
	background: transparent;
	border: 0;
	border-right: 1px solid #252a2f;
	font-size: var(--font-size-xs);
	text-transform: uppercase;
	cursor: pointer;
}

.browser-tab:last-child {
	border-right: 0;
}

.browser-tab svg {
	width: 1em;
	height: 1em;
}

.browser-tab:hover,
.browser-tab[data-active] {
	color: #eef7ff;
}

.browser-tab[data-active] {
	background: #151819;
	box-shadow: inset 0 -2px 0 var(--prime);
}

.browser-body {
	display: flex;
	flex-direction: column;
	gap: 0.8em;
	min-height: 0;
	flex: 1;
	padding: 0.8em;
	overflow: auto;
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
	min-height: 0;
	gap: 0.7em;
}

.media-toolbar {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto auto;
	gap: 0.5em;
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
	border: 1px solid #2a3036;
	border-radius: 6px;
	background: #20252a;
	color: #7f8999;
}

.search input {
	min-width: 0;
	width: 100%;
	color: #d7dde6;
	background: transparent;
	border: 0;
	outline: 0;
	font-size: var(--font-size-s);
}

.duration-control {
	display: grid;
	grid-template-columns: auto 4.8em auto;
	align-items: center;
	gap: 0.45em;
	height: 32px;
	color: #7f8999;
	font-size: var(--font-size-xs);
}

.duration-control input {
	min-width: 0;
	height: 100%;
	padding: 0 0.55em;
	color: #d7dde6;
	background: #20252a;
	border: 1px solid #2a3036;
	border-radius: 6px;
	font-size: var(--font-size-s);
}

.section-label {
	font-size: var(--font-size-xs);
	color: #7f8999;
	text-transform: uppercase;
}

.transition-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
	gap: 0.65em;
}

.transition-card {
	display: flex;
	flex-direction: column;
	gap: 0.55em;
	padding: 0.6em;
	color: #c9d0d8;
	background: #20252a;
	border: 1px solid #2a3036;
	border-radius: 8px;
	cursor: pointer;
	text-align: left;
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
.transition-card[data-active] {
	border-color: color-mix(in srgb, var(--prime) 65%, #2a3036);
	background: #242b31;
}

.transition-preview {
	position: relative;
	height: 56px;
	overflow: hidden;
	border-radius: 6px;
	background: #111;
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

.transition-name {
	color: #eef2f7;
	font-size: var(--font-size-s);
	font-weight: 600;
}

.transition-meta,
.placeholder,
.status {
	color: #7f8999;
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

