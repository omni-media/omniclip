
import {css} from "lit"
export default css`@layer view {

section {
	gap: 1em;
}

img {
	width: clamp(4em, 20vw, 20em);
	height: auto;
}

h2 {
	font-size: clamp(2em, 8vw, 4em);

	display: flex;
	flex-direction: column;
	text-align: center;

	small {
		opacity: 0.5;
		font-size: 0.5em;
	}
}

}`

