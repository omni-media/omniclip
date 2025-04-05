import {css} from "@benev/slate"

export const styles = css`

	::part(scroll) {
		overflow-x: visible;
		overflow-y: visible;
	}

	.trim-handles {
		cursor: grab;
		position: absolute;
		top: 0;
		z-index: 1;
		height: 50px;
		border: 1px solid #111;
		border-radius: 5px;

		&[data-no-file] {
			border: 3px dotted red;
			color: red;
		}

		&[data-grabbed] {
			opacity: 1 !important;
			cursor: grabbing;
		}

		&[data-selected] {
			z-index: 5;
			mix-blend-mode: overlay;
			background: rgb(255,255,255,0.8);
			touch-action: none;

			& .trim-handle-right, .trim-handle-left {
				filter: drop-shadow(2px 4px 6px black);
				background: white;
				display: flex;
				z-index: 3;
				align-items: center;
				justify-content: center;
				gap: 3px;
				position: absolute;
				width: 18px;
				height: 100%;
				cursor: e-resize;

				& .line {
					opacity: 0.7;
					width: 3px;
					height: 40%;
					background: #333;
					border-radius: 5px;
				}
			}
		}

		& .trim-handle-left {
			left: 0;
			z-index: 3;
			border-top-left-radius: 5px;
			border-bottom-left-radius: 5px;
		}

		& .trim-handle-right {
			right: 0;
			z-index: 3;
			border-top-right-radius: 5px;
			border-bottom-right-radius: 5px;
		}
	}

	.effect {
		display: flex;
		z-index: 1;
		align-items: center;
		background: #201f1f;
		border-radius: 5px;
		border: 1px solid #111;
		cursor: grab;
		position: absolute;
		top: 0;
		height: 50px;
		overflow: hidden;

		& .not-found {
			background: repeating-linear-gradient(45deg, #5D5D5D, #5D5D5D 10px, #858585 10px, #858585 20px);
			position: absolute;
			height: 100%;
		}

		&[data-grabbed] {
			z-index: 2;
			opacity: 0.5 !important;
		}

		&[data-selected] {
			filter: brightness(0.5);
		}

		&[data-hidden] {
			opacity: 0.2;
		}

		&[data-selected]::after {
			outline: 2px solid white;
			outline-offset: -2px;
			content: "";
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 5px;
			box-shadow: inset 0px 0px 6px 2px black;
		}

		& .no-file {
			margin: 0.2em;
			color: white;
			text-shadow: 0px 0px 5px black;
		}

		& .proxy {
			position: absolute;
			z-index: 10;
			top: 0;

			& svg {
				color: linear-gradient(180deg, #ffd275 0%, #f3b737 100%);
			}
		}

		& .progress {
			position: absolute;
			background: linear-gradient(180deg, #ffd275 0%, #f3b737 100%);
			width: 100%;
			bottom: 0;
		}

		& .progress-float {
			position: relative;
			z-index: 10;
			text-shadow: 0px 0px 5px black;
			color: white;
			font-family: Nippo-Regular;
			margin: 0.2em;
		}

		&:hover {
			border: 1px solid white;
		}
	}
`
