
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

.transform-input {
	flex: 1;
}

.transform-input::part(base) {
	border: none;
	background: transparent;
}

.transform-input::part(input) {
	width: 100%;
	color: #e0e0e0;
	text-align: center;
	font-size: var(--font-size-xs);
}

.transform-input::part(start),
.transform-input::part(end) {
	gap: 0;
}

.prefix {
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
	border: none;
	background: transparent;
	color: #7d8595;
	cursor: pointer;
	transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;

	&:hover {
		color: #ddd;
	}

	&[data-active] {
		color: #f0f0f0;
	}
}

.keyframe-toggle svg {
	width: 0.95em;
	height: 0.95em;
	fill: currentColor;
}
`

