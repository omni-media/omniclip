import {css} from "lit"

export default css`@layer view {

.track-header {
	display: flex;
	align-items: center;
	padding: 0.5em;
	background: #222;
	border-bottom: 1px solid #1a1a1a;
	user-select: none;
	gap: 1em;
	height: 60px;
}

.label {
	font-weight: bold;
	color: #ccc;
	font-size: 0.9em;
	margin-right: auto;
	white-space: nowrap;
}

.controls {
	display: flex;
	gap: 0.5em;
}

.controls button {
	display: flex;
	align-items: center;
	justify-content: center;
	background: #333;
	padding: 0.2em;
	border: none;
	color: #aaa;
	border-radius: 0.3em;
	cursor: pointer;
	transition: background 0.2s ease;
	font-size: 0.8em;
}

.controls button:hover {
	background: #444;
	color: white;
}

.controls svg {
	width: 1em;
	height: 1em;
}
}`
