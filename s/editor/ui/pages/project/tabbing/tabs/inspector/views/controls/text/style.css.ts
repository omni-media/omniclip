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
    color: #888;
    font-style: italic;
    text-align: center;
	}
}

.text-style-controls {
	display: flex;
	flex-direction: column;
	gap: 0;
}

.text-style-controls wa-details::part(header) {
	border-radius: 0;
}

.text-style-controls wa-details::part(base) {
	border-radius: 0;
}

.text-input {
	box-sizing: border-box;
	width: 100%;
	min-height: 5.5em;
	padding: 0.55em 0.65em;
	resize: vertical;
	background: #1f1f1f;
	border: 1px solid #303030;
	border-radius: 3px;
	color: #e0e0e0;
	font: inherit;
	font-size: var(--font-size-xs);
	line-height: 1.45;
}

.text-input:hover {
	border-color: #444;
}

.text-input:focus {
	border-color: #575757;
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
	background: #222;
	color: #eee;
	border: 1px solid #444;
	padding: 0.35em 0.45em;
	border-radius: 3px;
	font-size: var(--font-size-xs);
}

button {
	cursor: pointer;
	transition: 0.15s;
}

button:hover {
	background: #333;
}

.flex {
	display: flex;
	align-items: center;
	gap: 0.3em;
}
`

