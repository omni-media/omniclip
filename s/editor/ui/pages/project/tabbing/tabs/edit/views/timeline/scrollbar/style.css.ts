
import {css} from "lit"

export default css`@layer view {

:host {
	display: block;
}

.timeline-scrollbar {
	position: relative;
	height: 0.9em;
	background: #151515;
	border-top: 1px solid #242424;
	cursor: pointer;
	user-select: none;
}

.timeline-scrollbar-thumb {
	position: absolute;
	top: 0.22em;
	left: 0;
	height: 0.44em;
	background: #424242;
	border-radius: 1px;
	cursor: grab;
}

.timeline-scrollbar-thumb[hidden] {
	display: none;
}

.timeline-scrollbar-thumb:hover {
	background: #555;
}

.timeline-scrollbar-thumb:active {
	background: #686868;
	cursor: grabbing;
}

}`

