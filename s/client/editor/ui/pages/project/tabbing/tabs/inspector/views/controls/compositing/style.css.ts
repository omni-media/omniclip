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
	color: var(--inspector-muted);
	text-align: right;
}

.inputs {
	display: flex;
	flex: 1;
	align-items: center;
	gap: 0.5em;
	min-width: 0;
}

.input-group {
	display: flex;
	align-items: center;
	background: var(--inspector-control);
	border: 1px solid transparent;
	border-radius: 7px;
	overflow: hidden;
	flex: 0 0 80px;
}

.input-group:focus-within {
	border-color: var(--prime);
}

input[type="number"] {
	width: 100%;
	background: transparent;
	border: none;
	color: var(--inspector-text);
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
	color: var(--inspector-muted);
	font-size: 0.8em;
}

.blend-select {
	flex: 1;
}

wa-slider {
	flex: 1;
	min-width: 0;
}
`
