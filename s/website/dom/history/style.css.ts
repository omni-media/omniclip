
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

a {
	color: #bbb;
	text-decoration: none;
	transition: color 0.2s;
}

a:hover {
	color: #e8a020;
	text-decoration: none;
}

strong {
	color: #bbb;
	font-weight: 400;
}
`

