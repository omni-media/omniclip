import {css} from "lit"

export default css`@layer view {

:host {
	display: block;
	height: 100%;
	overflow-y: auto;
	background: #0f0f0f;
}

.export-container {
	display: grid;
	grid-template-columns: 300px 1fr;
	gap: 1.5em;
	max-width: 1000px;
	margin: 0 auto;
	padding: 1.5em;
}

.panel {
	display: flex;
	flex-direction: column;
	gap: 1em;
	background: #171717;
	padding: 1.5em;
	border-radius: 12px;
	border: 1px solid #242424;
}

h4 {
	font-size: 1em;
	font-weight: bold;
	color: #aaa;
	text-transform: uppercase;
	margin: 0;
	border-bottom: 1px solid #242424;
	padding-bottom: 0.8em;
}

.items-panel .list {
	display: flex;
	flex-direction: column;
	gap: 0.5em;
}

.item-card {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 1em;
	border-radius: 8px;
	background: #202020;
	border: 1px solid #2a2a2a;
	cursor: pointer;
	text-align: left;
	color: #ddd;
	transition: background 0.2s ease, border-color 0.2s ease;
}

.item-card:hover {
	background: #282828;
	border-color: #383838;
}

.item-card[data-selected] {
	background: color-mix(in srgb, var(--prime) 20%, #202020);
	border-color: var(--prime);
	box-shadow: 0 0 0 2px color-mix(in srgb, var(--prime) 30%, transparent);
}

.item-card .label {
	font-weight: 600;
	font-size: 1em;
}

.item-card .kind {
	font-size: 0.8em;
	color: #888;
	margin-top: 0.2em;
}

.empty-state {
	color: #666;
	font-style: italic;
	padding: 1em;
	text-align: center;
}

.settings-panel {
	gap: 1.5em;
}

.settings-group {
	display: flex;
	flex-direction: column;
	gap: 0.5em;
}

.settings-group label {
	font-weight: 600;
	color: #bbb;
}

.settings-group select {
	padding: 0.8em;
	background: #202020;
	border: 1px solid #2a2a2a;
	border-radius: 8px;
	color: #eee;
	font-size: 1em;
}

.export-action {
	margin-top: auto; /* Pushes the button to the bottom */
	padding-top: 1.5em;
	border-top: 1px solid #242424;
}

.export-button {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.8em;
	width: 100%;
	padding: 1em;
	font-size: 1.1em;
	font-weight: bold;
	background: var(--prime);
	color: black;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	transition: filter 0.2s ease;
}

.export-button:hover {
	filter: brightness(1.1);
}

.export-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
	filter: grayscale(1);
}

.export-button svg {
	width: 1.2em;
	height: 1.2em;
}

.progress-bar {
	width: 100%;
	background: #202020;
	border-radius: 8px;
	overflow: hidden;
	position: relative;
	height: 3em;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #2a2a2a;
}

.progress-bar span {
	position: relative;
	z-index: 1;
	color: #fff;
	font-weight: bold;
}

.progress-fill {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	background: var(--prime);
	transition: width 0.2s ease;
}

}`
