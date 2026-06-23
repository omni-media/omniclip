import {css} from "lit"

export default css`
.compositing-controls {
	display: flex;
	flex-direction: column;
	gap: 0.8em;
}

.control-row {
	display: flex;
	align-items: center;
	gap: 1em;
}

label {
	flex-shrink: 0;
	font-size: 0.9em;
	color: #ccc;
	text-align: right;
}

.inputs {
	display: flex;
	align-items: center;
	gap: 0.5em;
}

.input-group {
	display: flex;
	align-items: center;
	background: #1f1f1f;
	border: 1px solid #333;
	border-radius: 5px;
	overflow: hidden;
	flex-basis: 80px;
}

input[type="number"] {
	width: 100%;
	background: transparent;
	border: none;
	color: white;
	padding: 0.5em;
	text-align: center;
	-moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

.suffix {
	padding: 0 0.6em;
	color: #888;
	font-size: 0.8em;
}

.blend-select {
	flex: 1;
}

input[type="range"] {
	width: 100%;
	flex: 1;
	-webkit-appearance: none;
	appearance: none;
	background: transparent;
	cursor: pointer;
}

input[type="range"]::-webkit-slider-runnable-track {
	background: #333;
	height: 0.5rem;
	border-radius: 0.5rem;
}
input[type="range"]::-moz-range-track {
	background: #333;
	height: 0.5rem;
	border-radius: 0.5rem;
}

input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	margin-top: -4px; /* Center thumb on the track */
	background-color: #aaa;
	height: 1rem;
	width: 1rem;
	border-radius: 50%;
	border: 2px solid #1f1f1f;
}
input[type="range"]::-moz-range-thumb {
	border: none;
	border-radius: 50%;
	background-color: #aaa;
	height: 1rem;
	width: 1rem;
	border: 2px solid #1f1f1f;
}

input[type="range"]:hover::-webkit-slider-thumb {
	background-color: var(--prime);
}
input[type="range"]:hover::-moz-range-thumb {
	background-color: var(--prime);
}
`
