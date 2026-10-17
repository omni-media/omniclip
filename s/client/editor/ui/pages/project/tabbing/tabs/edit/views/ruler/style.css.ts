import {css} from "lit"

export default css`@layer view {

:host {
	display: block;
	position: sticky;
	top: 0;
	z-index: 2;
}

.ruler {
	display: block;
	position: sticky;
	left: 0;
	height: 32px;
	background: #1f1f1f;
	border-bottom: 1px solid #2a2a2a;
	cursor: ew-resize;
	width: 100vw;
}

.marker {
	position: absolute;
	bottom: 0;
	border-left: 1px solid #444;
	display: flex;
	align-items: flex-start;
	color: #888;
	font-size: 0.8em;
	user-select: none;
	pointer-events: none;
}

.marker.major {
	height: 100%;
}

.marker.medium {
	height: 50%;
}

.marker.minor {
	height: 25%;
	border-left-color: #333;
}

}`
