
import {css} from "lit"

export default css`@layer view {
.stack-tracks {
	display: flex;
	flex-direction: column;
}

.stack-block {
	display: inline-flex;
	align-items: center;
	gap: 0.5em;
	padding: 0.8em;
	background: #3a3a3a;
	border-radius: 5px;
	cursor: pointer;
	border: 1px solid #4a4a4a;
	transition: background 0.2s ease;
	overflow: hidden;
}

.stack-block:hover {
	background: #4a4a4a;
}

.stack-block .label {
	font-weight: bold;
	color: #ddd;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.stack-block .explore-indicator svg {
	width: 1em;
	height: 1em;
	color: #aaa;
	flex-shrink: 0;
}

}`

