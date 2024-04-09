import {css} from "@benev/slate"

export const styles = css`
	.box {
		display: flex;
		justify-content: center;
		position: absolute;
		z-index: 2;

		& .handle {
			position: absolute;
			background: white;
			z-index: 2;
			border: 1px solid gray;
			border-radius: 5px;
		}

		& .left {
			left: -1.5%;
		}

		& .right {
			right: -1.5%;
		}

		& .top {
			top: -1.5%;
		}

		& .bottom {
			bottom: -1.5%;
		}

		& .width {
			top: 42.5%;
			width: 3%;
			height: 15%;
			cursor: e-resize;
		}

		& .height {
			width: 15%;
			height: 3%;
			right: 42.5%;
			cursor: n-resize;
		}

		& .rect {
			border: 1px solid rgb(3, 169, 193);
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
