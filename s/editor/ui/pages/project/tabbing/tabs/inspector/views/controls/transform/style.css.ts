
import {css} from "lit"

export default css`

.transform-controls {
	display: flex;
	flex-direction: column;
	gap: 0.65em;

	&[data-disabled] {
		opacity: 0.5;
		pointer-events: none;
	}
}

.control-row {
	display: flex;
	align-items: center;
	gap: 1em;
	flex-wrap: wrap;
}

label {
	flex-basis: 55px;
	flex-shrink: 0;
	font-size: var(--font-size-xs);
	color: #aaa;
	text-align: left;
}

.inputs {
	display: flex;
	gap: 0.5em;
	flex-grow: 1;
}

.input-group {
	display: flex;
	align-items: center;
	background: #1f1f1f;
	border: 1px solid #303030;
	border-radius: 3px;
	overflow: hidden;
	flex: 1;
}

input[type="number"] {
	width: 100%;
	background: transparent;
	border: none;
	color: #e0e0e0;
	padding: 0.45em;
	text-align: center;
	font-size: var(--font-size-xs);
	-moz-appearance: textfield; /* Firefox */
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

.prefix, .suffix {
	padding: 0 0.6em;
	color: #888;
	font-size: 0.8em;
	display: flex;
	align-items: center;
	justify-content: center;
}

.prefix svg {
	width: 1em;
	height: 1em;
	fill: currentColor;
}

.keyframe-toggle {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.8em;
	height: 1.8em;
	padding: 0;
	border: 1px solid #333;
	border-radius: 3px;
	background: #1f1f1f;
	color: #7d8595;
	cursor: pointer;
	transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;

	&:hover {
		border-color: #555;
		color: #ddd;
	}

	&[data-active] {
		color: #f0f0f0;
		border-color: #555;
		background: #252525;
	}
}

.keyframe-toggle svg {
	width: 0.95em;
	height: 0.95em;
	fill: currentColor;
}
`

