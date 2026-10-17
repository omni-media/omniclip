
import {css} from "lit"

export default css`
:host {
	display: block;
	min-width: 0;
	min-height: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

video {
	display: block;
	min-width: 0;
	min-height: 0;
	max-width: 100%;
	max-height: 100%;
	width: 100%;
	height: 100%;
	object-fit: contain;
}
`
