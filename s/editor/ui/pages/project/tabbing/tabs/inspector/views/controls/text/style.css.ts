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

details {
	background: #1b1b1b;
	border: 1px solid #292929;
	border-radius: 4px;
	overflow: hidden;
}

summary {
	cursor: pointer;
	background: #202020;
	color: #cfcfcf;
	padding: 0.5em 0.7em;
	font-size: var(--font-size-xs);
	font-weight: 500;
	user-select: none;
	outline: none;
}

summary::marker {
	color: #888;
}

details[open] summary {
	border-bottom: 1px solid #333;
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

