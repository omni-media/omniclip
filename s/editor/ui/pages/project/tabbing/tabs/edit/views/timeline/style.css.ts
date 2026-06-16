import {css} from "lit"

export default css`@layer view {

:host {
	display: block;
	height: 100%;
}

.timeline {
	position: relative;
	overflow: auto;
	scrollbar-width: none;
	background: #111;
	border-top: 1px solid #1c1c1c;
}

.spacer {
	height: 1px;
}

.timeline::-webkit-scrollbar {
	display: none;
}

canvas {
	display: block;
	position: sticky;
	left: 0;
	top: 0;
}

}`

