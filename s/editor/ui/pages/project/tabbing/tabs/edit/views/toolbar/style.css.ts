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
	background: #1f1f1f;
	border-top: 1px solid #292929;
	border-bottom: 1px solid #151515;
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
	color: #aaa;
	border-radius: 0.18em;
	cursor: pointer;
	transition: background 0.12s ease, color 0.12s ease;
}

button:hover {
	background: #343434;
	color: #e8e8e8;
}

button:disabled {
	opacity: 0.32;
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
	background: #3a3a3a;
}

.play-pause {
	width: 2.25em;
	color: #e0e0e0;
	background: #292929;
}

.play-pause:hover {
	background: #3d3d3d;
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
	background: #3a3a3a;
}

.zoom-slider::part(indicator) {
	background: #636b75;
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

