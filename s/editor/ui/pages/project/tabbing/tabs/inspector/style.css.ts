import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #151515;
	color: #cfcfcf;
}

.placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding: 1em;
	color: #8f8f8f;
	font-size: var(--font-size-xs);
	text-align: center;
}

.inspector {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.panel-content {
	flex: 1;
	overflow-y: auto;
}

}`

