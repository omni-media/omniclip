import {css} from "lit"

export default css`@layer view {

:host {
	width: 100%;
}

.toolbar {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	padding: 0.5em 1em;
}

.toolbar > * {
	pointer-events: auto;
}

.toolbar-section {
	display: flex;
	align-items: center;
	gap: 1.5em;
}

.toolbar-section.left {
	grid-column: 1;
	justify-self: start;
	margin-left: 1em;
}

.toolbar-section.center {
	grid-column: 2;
	justify-self: center;
}

.toolbar-section.right {
	grid-column: 3;
	justify-self: end;
	margin-right: 1em;
}

.button-group {
	display: flex;
}

.transport-controls {
	align-items: center;
	gap: 0.2em;
}

button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2em;
	height: 2em;
	background: transparent;
	border: none;
	color: #aaa;
	border-radius: 0.5em;
	cursor: pointer;
	transition: background 0.2s ease, border-color 0.2s ease;
}

button:hover {
	background: #2f2f2f;
	border-color: #555;
	color: white;
}

button:disabled {
	opacity: 0.4;
	cursor: not-allowed;
	background: #202020;
}

button svg {
	width: 1.2em;
	height: 1.2em;
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
	font-size: 0.58em;
	font-weight: 700;
	line-height: 1;
	color: #ddd;
	text-align: center;
	pointer-events: none;
}

.transport-button[data-active] {
	color: white;
	background: #2f2f2f;
}

.play-pause {
	color: gray;
}

.play-pause:hover {
	filter: brightness(1.2);
}

.zoom-controls {
	display: flex;
	align-items: center;
	gap: 0.8em;
}

.zoom-button {
	width: 2em;
	height: 2em;
}

.zoom-slider {
	-webkit-appearance: none;
	appearance: none;
	width: 100px;
	height: 4px;
	background: #333;
	border-radius: 2px;
	outline: none;
	cursor: pointer;
}

/* Chrome, Safari, Opera, Edge */
.zoom-slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 16px;
	height: 16px;
	background: #aaa;
	border-radius: 50%;
	border: 2px solid #252525;
	transition: background 0.2s ease;
}

.zoom-slider::-webkit-slider-thumb:hover {
	background: #ccc;
}

/* Firefox */
.zoom-slider::-moz-range-thumb {
	width: 14px;
	height: 14px;
	background: #aaa;
	transition: background 0.2s ease;
}

.zoom-slider::-moz-range-thumb:hover {
	background: #ccc;
}

}
`


