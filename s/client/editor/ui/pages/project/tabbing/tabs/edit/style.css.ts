import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.canvas-container {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #0f0f0f;
	overflow: hidden;
}

.canvas-container > p {
	color: #444;
	font-style: italic;
}

.canvas-container > canvas {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

}`
