
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

.remove {
	position: absolute;
	top: 4px;
	right: 4px;
	display: grid;
	place-items: center;
	width: 20px;
	height: 20px;
	padding: 0;
	border: 0;
	border-radius: 4px;
	background: rgb(0 0 0 / 54%);
	color: white;
	font-size: 11px;
	opacity: 0;
	cursor: pointer;
	transition: opacity 120ms ease;
}

.remove:hover {
	background: rgb(190 42 42 / 90%);
}

.preview:hover > .remove {
	opacity: 1;
}
`
