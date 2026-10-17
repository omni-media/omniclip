
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

.lib-block {
	display: flex;
	align-items: flex-start;
	gap: 1em;
	margin: 0.5em 0;
	padding: 1em 1.3em;
	border-left: 1px solid #222;
}

.lib-icon {
	flex-shrink: 0;
	margin-top: 0.1em;
	color: #ccc;
	opacity: 0.4;
}

.lib-icon-image {
	width: 1.1em;
	height: 1.1em;
	border-radius: 0.2em;
	object-fit: cover;
	opacity: 0.55;
}

.lib-icon-emoji {
	width: 1.1em;
	height: 1.1em;
	font-size: var(--font-size-m);
	line-height: 1.125;
	opacity: 0.7;
}

.lib-name {
	display: inline-block;
	margin-bottom: 0.3em;
	color: #999;
	font-family: "IBM Plex Mono", ui-monospace, monospace;
	font-size: calc(var(--font-size-s) - 1px);
	text-decoration: none;
	transition: color 0.2s;
}

.lib-name:hover {
	color: #e8a020;
	text-decoration: none;
}

.lib-desc {
	color: #555;
	font-size: var(--font-size-s);
}

.library-note {
	margin-top: 1.3em;
}
`

