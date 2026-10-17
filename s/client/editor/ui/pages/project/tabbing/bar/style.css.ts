
import {css} from "lit"
export default css`@layer view {

nav {
	display: flex;
	gap: 0.2em;
	height: 100%;
	background: transparent;
}

button {
	background: transparent;
	border: none;
	color: #aaa;
	padding: 0 0.7em;
	cursor: pointer;
	border-radius: 0.25em;
	font-size: var(--font-size-xs);
	text-transform: capitalize;
	transition: background 0.12s ease, color 0.12s ease;
}

button:hover {
	background: #333;
	color: #e8e8e8;
}

button[data-active] {
	color: #e8e8e8;
	background: #3f3f3f;
}

}`

