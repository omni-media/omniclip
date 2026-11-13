import {css} from "lit"

export default css`
:host {
	display: block;
	width: min(58rem, calc(100vw - 4rem));
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	font-size: var(--font-size-sm);
	--tact-prime: #9299a6;
	--tact-text: #ddd;
	--tact-bg: #171717;
	--tact-round: 6px;
	--tact-space: 0.8em;
	--tact-box-shadow: none;
	--tact-text-shadow: none;
}

`
