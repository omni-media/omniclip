import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	width: 104px;
	max-width: 100%;
	height: 100%;
	border-right: 1px solid #292929;
	background: linear-gradient(180deg, #191919, #151515);
	color: #ddd;
}

header {
	display: flex;
	align-items: center;
	min-height: 36px;
	padding: 0 10px;
	border-bottom: 1px solid #101010;
	background: #1d1d1d;
	color: #aaa;
	font-size: var(--font-size-xs);
	letter-spacing: 0.04em;
}

.master-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 6px;
	min-height: 42px;
	padding: 0 10px;
	border-bottom: 1px solid #242424;

	strong {
		color: #ddd;
		font-size: var(--font-size-xs);
		font-weight: 650;
	}
}

.mute {
	width: 28px;
	height: 24px;
	padding: 0;
	border: 1px solid #2c2c2c;
	border-radius: 5px;
	background: #1d1d1d;
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
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	span {
		display: block;
		margin-top: 3px;
		color: #777;
		font-size: 0.55rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
}

.meter-grid {
	display: grid;
	flex: 1;
	min-height: 10em;
	grid-template-columns: 24px 18px 1fr;
	gap: 6px;
}

wa-slider {
	align-self: center;
	width: 24px;
	height: calc(100% - 40px);
	--track-size: 4px;
	--thumb-width: 24px;
	--thumb-height: 12px;

	&::part(slider), &::part(track) {
		height: 100%;
	}

	&::part(track) {
		border-radius: 99px;
		background: #0d0d0d;
		box-shadow: inset 0 0 0 1px #ffffff08;
	}

	&::part(indicator) {
		background: transparent;
	}

	&::part(thumb) {
		border: 1px solid #969696;
		border-radius: 3px;
		background:
			linear-gradient(#0000 calc(50% - 0.5px), #777 0 calc(50% + 0.5px), #0000 0),
			#d3d3d3;
		box-shadow: 0 2px 7px #0007;
	}
}

.meter {
	position: relative;
	margin: 20px 0;
	overflow: hidden;
	border-radius: 5px;
	background: #0d0d0d;
	box-shadow: inset 0 0 0 1px #ffffff09;
}

.meter-level {
	position: absolute;
	inset: 3px;
	border-radius: 3px;
	background: linear-gradient(to top, #20915b 0 66.67%, #d3ad3e 66.67% 83.33%, #c94e45 83.33%);

	&::before {
		content: "";
		position: absolute;
		inset: 0 0 auto;
		height: calc(100% - var(--level));
		background: #0d0d0d;
		transition: height 0.16s ease;
	}

	&::after {
		content: "";
		position: absolute;
		inset: calc(100% - var(--level)) -1px auto;
		height: 2px;
		border-radius: 2px;
		background: #ddd;
		opacity: 0.9;
		transition: top 0.16s ease;
	}
}

.scale {
	position: relative;
	margin: 20px 0;
	color: #666;
	font-size: 0.5rem;
	font-variant-numeric: tabular-nums;

	span {
		position: absolute;
		right: 0;
		bottom: var(--position);
		transform: translateY(50%);
		white-space: nowrap;

		&::before {
			content: "";
			position: absolute;
			right: 18px;
			top: 50%;
			width: 5px;
			height: 1px;
			background: #333;
		}

		&[data-zero] {
			color: #bbb;
			font-weight: 700;

			&::before {
				width: 8px;
				background: #777;
			}
		}
	}
}

footer {
	display: grid;
	gap: 5px;
	margin-top: 2px;
	padding-top: 10px;
	border-top: 1px solid #292929;
	color: #777;
	font-size: 0.55rem;

	span {
		display: flex;
		justify-content: space-between;
		gap: 6px;
	}

	strong {
		color: #aaa;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
}

}`
