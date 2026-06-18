import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.placeholder {
	padding: 1em;
	color: #888;
	font-style: italic;
	text-align: center;
	margin-top: 2em;
}

.inspector {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.tab-bar {
	display: flex;
	flex-shrink: 0;
	height: 36px;
	background: #222;
	border-bottom: 1px solid #1a1a1a;
	padding: 0.2em;
	gap: 0.2em;
}

.tab-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2em;
	height: 100%;
	background: transparent;
	border: none;
	color: #aaa;
	border-radius: 0.4em;
	cursor: pointer;
	transition: background 0.2s ease, color 0.2s ease;
}

.tab-button:hover {
	background: #333;
	color: white;
}

.tab-button[data-active] {
	background: #444;
	color: white;
}

.tab-button svg {
	width: 1.05em;
	height: 1.05em;
}

.panel-content {
	flex: 1;
	overflow-y: auto;
	padding: 1em;
}

}`

