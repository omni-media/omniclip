import {css} from "@benev/slate"

export const styles = css`
	.text-rect {
		z-index: 999;
		outline: 1px solid white;
		display: flex;
		justify-content: center;

		& .rotate {
			position: absolute;
			top: -25px;
			cursor: grab;
			display: flex;
			fill: white;

			& svg {
				width: 15px;
				height: 15px;
			}
		}
	}
`
