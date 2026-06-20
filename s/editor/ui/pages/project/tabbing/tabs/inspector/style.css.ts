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

.panel-content {
	flex: 1;
	overflow-y: auto;
	padding: 1em;
}

}`

