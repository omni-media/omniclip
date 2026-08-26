
import {css} from "lit"

export default css`@layer view {

:host {
	display: block;
}

.timeline-scrollbar {
	position: relative;
	height: 0.75em;
	background: #151515;
	border-top: 1px solid #242424;
	cursor: pointer;
	user-select: none;
}

.timeline-scrollbar-thumb {
	position: absolute;
	top: 0.19em;
	left: 0;
	height: 0.36em;
	background: #505050;
	border-radius: 2px;
	cursor: grab;
}

.timeline-scrollbar-thumb[hidden] {
	display: none;
}

.timeline-scrollbar-thumb:hover {
	background: #686868;
}

.timeline-scrollbar-thumb:active {
	background: #7a7a7a;
	cursor: grabbing;
}

}`

