import {css} from "lit"

export default css`@layer view {

:host {
	display: contents;
}

wa-dropdown::part(menu) {
	min-width: 10em;
	padding: 0.35em;
	border-color: #383838;
	border-radius: 0.45em;
	background: #202020;
	box-shadow: 0 0.6em 1.8em #000a;
}

wa-dropdown-item {
	padding: 0.55em 0.7em;
	font-size: var(--font-size-xs);
}

span {
	display: flex;
	color: #aaa;
}

button {
	all: unset;
	position: fixed;
	width: 1px;
	height: 1px;
	opacity: 0;
	pointer-events: none;
}

}`
