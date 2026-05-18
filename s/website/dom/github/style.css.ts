
import {css} from "lit"

export default css`
:host {
	display: block;
}

.gh-widget {
	margin: 2em 0 0;
	border: 1px solid #1d1d1d;
	border-radius: 0.3em;
	background: #0c0c0c;
	font-family: "IBM Plex Mono", ui-monospace, monospace;
}

.gh-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 1em;
	padding: 1em 1.2em;
	border-bottom: 1px solid #1d1d1d;
	background: #161616;
}

.gh-repo {
	display: flex;
	align-items: center;
	gap: 0.7em;
	color: #888;
	font-size: var(--font-size-xs);
}

.gh-repo svg {
	width: 1.2em;
	height: 1.2em;
	color: currentColor;
}

.gh-repo a {
	color: #ccc;
	text-decoration: none;
}

.gh-repo a:hover {
	color: #e8a020;
	text-decoration: none;
}

.gh-stats {
	display: flex;
	gap: 1.5em;
	color: #555;
	font-size: calc(var(--font-size-xs) - 1px);
}

.gh-stats b {
	margin-right: 0.4em;
	color: #e8a020;
	font-weight: 400;
}

.gh-stats b.loading {
	color: #333;
}

.gh-commits-label {
	padding: 1.2em 1.4em 0.6em;
	color: #444;
	font-size: calc(var(--font-size-xs) - 2px);
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.gh-commits {
	display: flex;
	flex-direction: column;
	gap: 0.5em;
	margin: 0;
	padding: 0 1.2em 1em;
	list-style: none;
}

.gh-commits li {
	display: grid;
	grid-template-columns: 5.3em 1fr auto;
	align-items: baseline;
	gap: 1em;
	padding: 0.5em 0;
	border-top: 1px dashed #1a1a1a;
	font-size: var(--font-size-xs);
}

.gh-commits li:first-child {
	border-top: none;
}

.gh-sha {
	color: #e8a020;
	font-size: calc(var(--font-size-xs) - 1px);
	text-decoration: none;
}

.gh-sha:hover {
	text-decoration: underline;
}

.gh-msg {
	overflow: hidden;
	color: #aaa;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.gh-meta {
	color: #555;
	font-size: calc(var(--font-size-xs) - 2px);
	white-space: nowrap;
}

.gh-empty {
	display: block;
	color: #555;
	font-size: calc(var(--font-size-xs) - 1px);
}

.gh-skel {
	display: block;
	height: 1.4em;
	margin: 0.4em 0;
	border-top: none;
	border-radius: 0.2em;
	background: linear-gradient(90deg, #161616, #1d1d1d, #161616);
	background-size: 200% 100%;
	animation: gh-shimmer 1.6s ease infinite;
}

@keyframes gh-shimmer {
	0% { background-position: 200% 0; }
	100% { background-position: -200% 0; }
}

@media (max-width: 520px) {
	.gh-commits li {
		grid-template-columns: 4.7em 1fr;
	}

	.gh-meta {
		grid-column: 2;
	}
}
`

