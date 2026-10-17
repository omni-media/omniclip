
import {css} from "lit"

export default css`
:host {
	display: block;
}

.label {
	margin-bottom: 1.8em;
	color: #444;
	font-family: "IBM Plex Mono", ui-monospace, monospace;
	font-size: calc(var(--font-size-xs) - 1px);
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

p {
	margin-bottom: 0.9em;
	color: #777;
	font-size: calc(var(--font-size-m) - 1px);
}

p:last-child {
	margin-bottom: 0;
}

.feat-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.1em;
	margin: 1.5em 0;
}

.feat-item {
	padding: 1.1em 1.2em;
	background: #161616;
	color: #777;
	font-size: calc(var(--font-size-s) - 1px);
	font-weight: 300;
	line-height: 1.4;
}

.feat-item b {
	display: block;
	margin-bottom: 0.15em;
	color: #bbb;
	font-size: calc(var(--font-size-s) - 1px);
	font-weight: 400;
}

@media (max-width: 500px) {
	.feat-grid {
		grid-template-columns: 1fr;
	}
}
`

