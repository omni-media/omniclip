import {css} from "lit"

export default css`
:host {
	display: flex;
	height: 45px;
}

.filmstrip-container {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.thumbnail {
	position: absolute;
	top: 0;
	height: 100%;
}

.thumbnail > canvas {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
`
