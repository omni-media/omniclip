import {css} from "lit"

export default css`
.playhead {
	position: absolute;
	top: 0;
	height: 100%;
	z-index: 2;
	pointer-events: none;
}

.playhead svg {
	fill: white;
	width: 1em;
	height: 1em;
	position: absolute;
	top: -35px;
	left: -8px;
	transform: rotate(180deg);
	filter: drop-shadow(0 2px 2px #0008);
}

.playhead .line {
	width: 2px;
	height: 100vh;
	top: -20px;
	background: white;
	margin-left: -1px;
	position: relative;
}
`
