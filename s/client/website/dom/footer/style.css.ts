
import {css} from "lit"

export default css`
:host {
	display: block;
}

footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 1em;
	margin-top: 6.2em;
	padding-top: 2.3em;
	border-top: 1px solid #1a1a1a;
}

footer span,
.f-links a {
	color: #2e2e2e;
	font-family: "IBM Plex Mono", ui-monospace, monospace;
	font-size: var(--font-size-xs);
}

.f-links {
	display: flex;
	gap: 1.7em;
}

.f-links a {
	color: #383838;
	text-decoration: none;
	transition: color 0.2s;
}

.f-links a:hover {
	color: #777;
	text-decoration: none;
}
`

