
import {css} from "@benev/slate"
export default css`@layer view {

.plate {
	font-size: 1.5em;

	padding: 2em;
	margin: auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 1em;

	& img {
		max-width: 100%;
		width: 10em;
	}

	h2 {
		font-family: sans-serif;
		> span:nth-child(2) { opacity: 0.5; font-weight: normal; }
	}
}

}`

