
import {css} from "lit"

export default css`
:host {
	display: block;
	width: 100%;
	height: 100%;
}

.preview {
	position: relative;
	width: 100%;
	height: 100%;
	pointer-events: auto;
}

.preview[data-addable] {
	cursor: pointer;
}

img {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.overlay {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgb(0 0 0 / 32%);
	color: rgb(255 255 255 / 46%);
	font-size: 32px;
	opacity: 0;
	transition: opacity 120ms ease;
	pointer-events: none;
}

.preview:hover > .overlay {
	opacity: 1;
}
`

