
import {css} from "lit"
export default css`@layer view {

:host {
	display: block;

	width: 100%;
	height: 100%;
	margin: auto;
}

[view="shiny-drawer"] {
	display: block;
	width: 100%;
	height: 100%;
	--button-size: 2em;
	--drawer-height: 100%;
	--blanket-backdrop-filter: blur(0.5em);
}

nav {
	font-size: clamp(1em, 6vw, 1.5em);

	display: flex;
	flex-direction: column;
	gap: 0.5em;
	padding:
		clamp(0.2em, 5vh, 1.5em)
		clamp(0.2em, 5vw, 1.5em);

	background: #333c;
	border-bottom-right-radius: 1em;
}

section {
	width: 100%;
	height: 100%;
	background: #fff1;

	> sly-view {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
}

}`

