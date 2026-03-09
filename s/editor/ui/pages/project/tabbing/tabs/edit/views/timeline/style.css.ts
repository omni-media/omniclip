import {css} from "lit"

export default css`@layer view {

:host {
	display: block;
	height: 100%;
}

.timeline-scroll {
	height: 100%;
	overflow: auto;
	background: #111;
	border-top: 1px solid #1c1c1c;
}

.timeline-scroll::-webkit-scrollbar {
	height: 10px;
	width: 10px;
}

.timeline-scroll::-webkit-scrollbar-thumb {
	background: #2a2a2a;
	border-radius: 999px;
}

.timeline-scroll::-webkit-scrollbar-track {
	background: #161616;
}

canvas {
	display: block;
}

}`

