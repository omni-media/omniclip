import {css} from "lit"

export default css`@layer view {

:host {
	width: 100%;
}

.toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.22em 0.75em;
}

.toolbar > * {
	pointer-events: auto;
}

.toolbar-section {
	display: flex;
	align-items: center;
	gap: 0.6em;
}

.button-group {
	display: flex;
	align-items: center;
	gap: 0.1em;
	padding: 0.05em;
}

.tool-trigger {
	width: 2.7em;
	gap: 0.25em;
	background: #1c1c1c;
	color: #999;
}

.tool-trigger:hover {
	background: #2b2b2b;
}

.tool-trigger > wa-icon:first-child {
	font-size: 0.95em;
}

.tool-caret {
	color: #888;
	font-size: 0.55em;
}

.tool-picker::part(menu) {
	min-width: 15.5em;
	padding: 0.45em;
	border-color: #383838;
	border-radius: 0.45em;
	background: #202020;
	box-shadow: 0 0.6em 1.8em #000a;
}

.tool-picker small {
	display: block;
	padding: 0.25em 0.75em 0.55em;
	color: #8f8f8f;
	font-size: calc(var(--font-size-xs) - 1px);
	font-weight: 600;
	letter-spacing: 0.03em;
	text-transform: uppercase;
}

.tool-picker wa-dropdown-item {
	min-height: 2.35em;
	padding: 0.55em 0.75em;
	border-radius: 0.3em;
	color: #c8c8c8;
	font-size: var(--font-size-xs);
	line-height: 1.2;
}

.tool-picker wa-dropdown-item:hover {
	background: #2d2d2d;
}

.tool-picker wa-dropdown-item wa-icon[slot="icon"] {
	width: 1.15em;
	color: #aaa;
	font-size: 1.05em;
}

.tool-picker wa-dropdown-item[data-active] {
	background: #292929;
	color: #eee;
}

.tool-picker wa-dropdown-item[data-active]:hover {
	background: #333;
}

.tool-picker kbd {
	display: inline-block;
	min-width: 3.5em;
	color: #7f7f7f;
	font: inherit;
	font-size: calc(var(--font-size-xs) - 1px);
	text-align: end;
}

.transport-controls {
	align-items: center;
	gap: 0.2em;
}

button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.8em;
	height: 1.65em;
	background: transparent;
	border: none;
	color: #b8b8b8;
	border-radius: 0.18em;
	cursor: pointer;
	transition: background 0.12s ease, color 0.12s ease;
}

button:hover {
	background: #2b2b2b;
	color: #e8e8e8;
}

button:disabled {
	opacity: 0.48;
	cursor: not-allowed;
	background: transparent;
}

button svg {
	width: 1.05em;
	height: 1.05em;
}

.transport-button {
	position: relative;
}

.transport-button.reverse svg {
	transform: scaleX(-1);
}

.transport-button span {
	position: absolute;
	inset-inline-end: -0.15em;
	inset-block-end: -0.15em;
	min-width: 1.8em;
	font-size: calc(var(--font-size-xs) - 3px);
	font-weight: 700;
	line-height: 1;
	color: #ddd;
	text-align: center;
	pointer-events: none;
}

.transport-button[data-active] {
	color: #f0f0f0;
	background: #303030;
}

.play-pause {
	width: 2.25em;
	color: #e0e0e0;
	background: #242424;
}

.play-pause:hover {
	background: #333;
}

.timecode {
	min-width: 7.5em;
	padding: 0 0.45em;
	font-variant-numeric: tabular-nums;
	font-size: var(--font-size-s);
	line-height: 1.65em;
	color: #cfcfcf;
	text-align: center;
}

.zoom-controls {
	display: flex;
	align-items: center;
	gap: 0.35em;
}

.zoom-button {
	width: 1.8em;
	height: 1.8em;
}

.zoom-slider {
	width: 8em;
	--track-size: 0.32em;
	--thumb-width: 0.85em;
	--thumb-height: 0.85em;
}

.zoom-slider::part(track) {
	background: #303030;
}

.zoom-slider::part(indicator) {
	background: #555d66;
}

.zoom-slider::part(thumb) {
	background: #b8b8b8;
	border: 1px solid #1b1b1b;
	box-shadow: none;
}

.zoom-readout {
	min-width: 3.6em;
	font-variant-numeric: tabular-nums;
	font-size: var(--font-size-xs);
	color: #a8a8a8;
	text-align: end;
}

}
`

