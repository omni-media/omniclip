
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
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: center;
	gap: 0.35em 0.5em;
}

.control-row > label {
	grid-column: 1 / -1;
}

label {
	flex-basis: 55px;
	flex-shrink: 0;
	font-size: var(--font-size-xs);
	color: var(--inspector-muted);
	text-align: left;
}

.inputs {
	display: flex;
	gap: 0.5em;
}

.input-group {
	display: flex;
	align-items: center;
	background: var(--inspector-control);
	border: 1px solid transparent;
	border-radius: 7px;
	overflow: hidden;
	flex: 1;
}

.input-group:focus-within {
	border-color: var(--prime);
}

.transform-input {
	flex: 1;
}

.scale-link,
.transform-reset {
	align-self: center;
	padding: 0;
	border: 0;
	background: transparent;
	color: var(--inspector-muted);
	cursor: pointer;
}

.scale-link[aria-pressed="true"],
.transform-reset:hover {
	color: var(--inspector-text);
}

.scale-link wa-icon,
.transform-reset wa-icon {
	display: block;
	font-size: 0.8em;
}

.transform-input::part(base) {
	border: none;
	background: transparent;
}

.transform-input::part(input) {
	width: 100%;
	color: var(--inspector-text);
	text-align: center;
	font-size: var(--font-size-xs);
}

.transform-input::part(start),
.transform-input::part(end) {
	gap: 0;
}

.prefix {
	color: var(--inspector-muted);
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
	color: var(--inspector-muted);
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
