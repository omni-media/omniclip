
import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #151515;
	color: #cfcfcf;
}

header {
	display: flex;
	align-items: center;
	min-height: 32px;
	padding: 0 0.75em;
	border-bottom: 1px solid #101010;
	background: #1d1d1d;
	color: #d8d8d8;
	font-size: var(--font-size-xs);
}

.strip {
	display: grid;
	grid-template-rows: auto auto minmax(8em, 1fr) auto;
	gap: 0.65em;
	width: 4.6em;
	height: 100%;
	padding: 0.75em 0.35em 0.55em;
	border-right: 1px solid #292929;
	background: linear-gradient(90deg, #191919, #1c1c1c, #191919);
}

.strip-title {
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 0.65em;
	min-height: 3.2em;
}

.strip-title strong {
	color: #ddd;
	font-size: calc(var(--font-size-xs) - 1px);
	font-weight: 500;
}

.strip-title span, output {
	color: #929292;
	font-size: calc(var(--font-size-xs) - 2px);
}

button {
	justify-self: center;
	width: 2.4em;
	height: 2.1em;
	padding: 0;
	border: 1px solid #2c2c2c;
	border-radius: 3px;
	background: #1d1d1d;
	color: #a2a2a2;
	font: inherit;
	font-size: var(--font-size-xs);
	cursor: pointer;

	&:hover, &[data-active] {
		border-color: #454545;
		background: #303030;
		color: #eee;
	}
}

.fader {
	display: grid;
	grid-template-columns: 1.15em 1.35em;
	justify-content: center;
	padding: 0.8em 0;
}

.meter {
	grid-area: 1 / 1;
	justify-self: start;
	position: relative;
	width: 0.42em;
	margin-left: 0.1em;
	overflow: hidden;
	border-radius: 1px;
	background: linear-gradient(to top, #20915b 0 75%, #d3ad3e 83.33%, #c94e45);
	box-shadow: inset 0 0 0 1px #0008;

	&::after {
		content: "";
		position: absolute;
		inset: 0 0 auto;
		height: calc(100% - var(--level));
		background: #101010;
	}
}

wa-slider {
	grid-area: 1 / 1;
	z-index: 1;
	width: 1.15em;
	height: 100%;
	--track-size: 2px;
	--thumb-width: 1em;
	--thumb-height: 1.55em;

	&::part(slider), &::part(track) {
		height: 100%;
	}

	&::part(track) {
		border-radius: 0;
		background: #0d0d0d;
		box-shadow: 0 0 0 1px #242424;
	}

	&::part(indicator) {
		border-radius: 0;
		background: #303030;
	}

	&::part(thumb) {
		border: 1px solid #969bad;
		border-radius: 2px;
		background:
			linear-gradient(#0000 calc(50% - 0.5px), #777d92 0 calc(50% + 0.5px), #0000 0),
			#d7d9e2;
		box-shadow: 0 1px 2px #000a, inset 0 0 0 1px #fff5;
	}
}

.scale {
	grid-area: 1 / 2;
	display: flex;
	align-items: end;
	justify-content: space-between;
	flex-direction: column;
	color: #666;
	font-size: 0.5rem;
	line-height: 1;
}

output {
	text-align: center;
	font-variant-numeric: tabular-nums;
}

}`

