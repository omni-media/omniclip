
import {css} from "lit"

export default css`

.transform-controls {
	display: flex;
	flex-direction: column;
	gap: 0.8em;

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
	font-size: 0.9em;
	color: #ccc;
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
	border: 1px solid #333;
	border-radius: 5px;
	overflow: hidden;
	flex: 1;
}

input[type="number"] {
	width: 100%;
	background: transparent;
	border: none;
	color: white;
	padding: 0.5em;
	text-align: center;
	-moz-appearance: textfield; /* Firefox */
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

.prefix, .suffix {
	padding: 0 0.6em;
	background: #2a2a2a;
	color: #888;
	font-weight: bold;
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

.suffix {
	border-left: 1px solid #333;
}

.prefix {
	border-right: 1px solid #333;
}

.keyframe-toggle {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.8rem;
	height: 1.8rem;
	padding: 0;
	border: 1px solid #333;
	border-radius: 6px;
	background: #161a22;
	color: #7d8595;
	cursor: pointer;
	transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;

	&:hover {
		border-color: #5d6471;
		color: #d7dde8;
	}

	&[data-active] {
		color: #fbbf24;
		border-color: #8a6108;
		background: #2b2311;
	}
}

.keyframe-toggle svg {
	width: 0.95rem;
	height: 0.95rem;
	fill: currentColor;
}
`

