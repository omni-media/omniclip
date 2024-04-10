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
			min-width: 5px;
			min-height: 5px;
		}

		& .corner {
			width: 10px;
			height: 10px;
		}

		& .top-left {
			top: -5px;
			left: -5px;
			cursor: nwse-resize;
		}

		& .top-right {
			top: -5px;
			right: -5px;
			cursor: nesw-resize;
		}

		& .bottom-right {
			bottom: -5px;
			right: -5px;
			cursor: nw-resize;
		}

		& .bottom-left {
			bottom: -5px;
			left: -5px;
			cursor: ne-resize;
		}

		& .left {
			left: -5px;
		}

		& .right {
			right: -5px;
		}

		& .top {
			top: -5px;
		}

		& .bottom {
			bottom: -5px;
		}

		& .width {
			top: 42.5%;
			width: 10px;
			height: 15%;
			cursor: e-resize;
		}

		& .height {
			width: 15%;
			height: 10px;
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
