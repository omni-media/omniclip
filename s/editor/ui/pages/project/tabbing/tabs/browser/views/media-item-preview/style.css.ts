
import {css} from "lit"

export default css`
:host {
	display: block;
	width: 100%;
	height: 100%;
}

.preview {
	position: relative;
	display: grid;
	place-items: center;
	width: 100%;
	height: 100%;
	pointer-events: auto;
}

.preview > sl-icon {
	color: #999;
	font-size: 1.4rem;
}

img {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.add,
.remove {
	position: absolute;
	display: grid;
	place-items: center;
	width: 20px;
	height: 20px;
	padding: 0;
	border: 0;
	border-radius: 4px;
	color: white;
	font-size: 11px;
	cursor: pointer;
	opacity: 0;
	transition: background 120ms ease, opacity 120ms ease;
}

.upload {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(to right, rgb(92 144 220 / 58%) var(--progress), rgb(0 0 0 / 48%) var(--progress));
	color: white;
	font-size: var(--font-size-xs);
	font-variant-numeric: tabular-nums;
	pointer-events: none;
}

.add {
	right: 4px;
	bottom: 4px;
	background: rgb(35 93 184 / 92%);
}

.remove {
	top: 4px;
	right: 4px;
	background: rgb(0 0 0 / 54%);
}

.remove:hover {
	background: rgb(190 42 42 / 90%);
}

.preview:hover > .remove {
	opacity: 1;
}

.preview:hover > .add {
	opacity: 0.9;
}

.add:hover,
.add:focus-visible {
	background: rgb(49 113 216 / 100%);
	opacity: 1;
}
`
