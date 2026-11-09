
import {css} from "lit"

export default css`@layer view {

wa-tab-group {
	display: block;
	min-height: 0;
	overflow: auto;
	--indicator-color: transparent;
	--track-width: 0;

	&::part(tabs) {
		width: 100%;
		box-sizing: border-box;
		height: 32px;
		gap: 0.15em;
		padding: 0.2em;
		border: 0;
		border-radius: 7px;
		background: #191919;
	}

	&::part(nav) {
		margin: 0.2em 0.4em;
	}
}

wa-tab {
	flex: 1;
	color: #aaa;
	font-weight: inherit;
	border-block-end: 0;
	margin-block-end: 0;

	&::part(tab) {
		display: flex;
		justify-content: center;
		height: 100%;
		box-sizing: border-box;
		padding: 0 0.7em;
		border-radius: 5px;
		font-size: var(--font-size-xs);
		transition: background 0.12s ease, color 0.12s ease;
	}

	&:hover::part(tab) {
		color: #e8e8e8;
		background: #222;
	}

	&[data-active]::part(tab) {
		color: #e8e8e8;
		background: #2a2a2a;
	}
}

wa-tab-panel {
	--padding: 0;
}

:host {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #0f0f0f;
	color: #cfcfcf;
}

}`

