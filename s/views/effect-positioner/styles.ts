import {css} from "@benev/slate"

export const styles = css`
	.box {
		display: flex;
		justify-content: center;
		position: absolute;
		z-index: 2;

		& .text-rect {
			position: absolute;
			outline: 1px solid rgb(3, 169, 193);
			display: flex;
			justify-content: center;
			width: 100%;
			height: 100%;
		}

		& .rotate {
			position: absolute;
			background: rgb(24, 24, 24);
			border-radius: 100%;
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
