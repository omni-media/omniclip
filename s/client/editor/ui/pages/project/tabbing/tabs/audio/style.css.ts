import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	width: 104px;
	max-width: 100%;
	height: 100%;
	background: #0f0f0f;
	color: #ddd;
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	text-shadow: none;
}

.master-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 6px;
	min-height: 42px;
	padding: 0 10px;

	strong {
		color: #ddd;
		font-size: var(--font-size-xs);
		font-weight: 500;
	}
}

.mute {
	width: 28px;
	height: 24px;
	padding: 0;
	border: 1px solid #ffffff0a;
	border-radius: 7px;
	background: #222;
	color: #a2a2a2;
	font: inherit;
	font-size: var(--font-size-xs);
	cursor: pointer;

	&:hover {
		color: #eee;
		background: #303030;
	}

	&[data-active] {
		border-color: #633137;
		background: #382124;
		color: #ff8991;
	}
}

.meter-zone {
	display: flex;
	flex: 1;
	min-height: 0;
	flex-direction: column;
	padding: 12px 8px 10px;
}

.readout {
	margin-bottom: 10px;
	text-align: center;

	output {
		display: block;
		font-size: 0.95rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	span {
		display: block;
		margin-top: 3px;
		color: #777;
		font-size: 0.65rem;
	}
}

.meter-grid {
	display: grid;
	flex: 1;
	min-height: 10em;
	grid-template-columns: 24px 20px 1fr;
	gap: 6px;
}

wa-slider {
	align-self: center;
	width: 24px;
	height: calc(100% - 40px);
	--track-size: 4px;
	--thumb-width: 22px;
	--thumb-height: 14px;

	&::part(slider), &::part(track) {
		height: 100%;
	}

	&::part(track) {
		border-radius: 99px;
		background: #242424;
	}

	&::part(indicator) {
		background: transparent;
	}

	&::part(thumb) {
		border: 1px solid #ffffff24;
		border-radius: 5px;
		background: #c4c8cd;
		box-shadow: 0 1px 3px #0004;
	}
}

.meter {
	position: relative;
	margin: 20px 0;
	overflow: hidden;
	border-radius: 7px;
	background: #191919;
}

.meter-level {
	position: absolute;
	inset: 3px;
	border-radius: 4px;
	background: linear-gradient(to top, #46ad87 0%, #73be92 60%, #d5bd70 80%, #db7773 100%);

	&::before {
		content: "";
		position: absolute;
		inset: 0 0 auto;
		height: calc(100% - var(--level));
		background: #191919;
		transition: height 0.16s ease;
	}
}

.scale {
	position: relative;
	margin: 20px 0;
	color: #858585;
	font-size: 0.6rem;
	font-variant-numeric: tabular-nums;

	span {
		position: absolute;
		left: 0;
		right: 0;
		bottom: var(--position);
		transform: translateY(50%);
		text-align: right;
		white-space: nowrap;
		&[data-zero] {
			color: #bbb;
			font-weight: 500;
		}
	}
}

}`
