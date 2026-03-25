import {css} from "lit"

export default css`@layer view {

:host {
	display: block;
	height: 100%;
}

.timeline {
	position: relative;
	overflow: auto;
	background: #111;
	border-top: 1px solid #1c1c1c;
}

.spacer {
	height: 1px;
}

.timeline::-webkit-scrollbar {
	height: 10px;
	width: 10px;
}

.timeline::-webkit-scrollbar-thumb {
	background: #2a2a2a;
	border-radius: 999px;
}

.timeline::-webkit-scrollbar-track {
	background: #161616;
}

canvas {
	display: block;
	position: sticky;
	left: 0;
	top: 0;
}

}`

