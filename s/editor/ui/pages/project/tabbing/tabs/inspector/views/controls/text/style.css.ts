import {css} from "lit"

export default css`

.panel {
	display: flex;
	flex-direction: column;
	gap: 0.6em;
	width: 100%;
}

.create-styles {
	display: flex;
	gap: 0.5em;
}

.disabled {
	opacity: 0.5;
	pointer-events: none;

	.info {
		padding: 1em;
		color: var(--inspector-muted);
		font-style: italic;
		text-align: center;
	}
}

.text-style-controls {
	display: flex;
	flex-direction: column;
	gap: 0.55em;
}

.text-input {
	box-sizing: border-box;
	width: 100%;
	min-height: 5.5em;
	padding: 0.7em 0.8em;
	resize: vertical;
	background: var(--inspector-control);
	border: 1px solid transparent;
	border-radius: 8px;
	color: var(--inspector-text);
	font: inherit;
	font-size: var(--font-size-xs);
	line-height: 1.45;
}

.text-input:focus {
	border-color: var(--prime);
	outline: none;
}

.cnt {
	padding: 0.65em 0.7em;
	display: flex;
	flex-direction: column;
	gap: 0.5em;
}

[data-enabled=false] {
	opacity: 0.5;
}

label {
	font-size: var(--font-size-xs);
	opacity: 0.8;
}

input,
select,
button {
	background: var(--inspector-control);
	color: var(--inspector-text);
	border: 1px solid transparent;
	padding: 0.4em 0.55em;
	border-radius: 7px;
	font-size: var(--font-size-xs);
}

button {
	cursor: pointer;
	transition: 0.15s;
}

button:hover {
	background: var(--inspector-hover);
}

.flex {
	display: flex;
	align-items: center;
	gap: 0.3em;
}
`
