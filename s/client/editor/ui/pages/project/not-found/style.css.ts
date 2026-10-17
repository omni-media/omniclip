
import {css} from "lit"

export default css`@layer view {

.project-not-found {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.8em;
	min-height: calc(100vh - 2.5em);
	padding: 2em;
	text-align: center;
	color: #cfd6e0;
}

h1 {
	margin: 0;
	font-size: 1.4em;
}

p {
	max-width: 28em;
	margin: 0;
	color: #8e96a6;
	font-size: var(--font-size-s);
}

a {
	color: var(--prime);
	text-decoration: none;
}

a:hover {
	text-decoration: underline;
}

}`

