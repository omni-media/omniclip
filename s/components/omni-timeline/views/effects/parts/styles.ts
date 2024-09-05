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

		&[data-no-file] {
			border: 3px dotted red;
			color: red;
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
				z-index: 1;
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
		cursor: pointer;
		position: absolute;
		top: 0;
		height: 50px;
		overflow: hidden;
		

		&[data-grabbed] {
			filter: brightness(0.5);
			z-index: 2;
		}

		&[data-selected] {
			filter: brightness(0.5);
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

		&:hover {
			outline: 1px solid gray;
		}
	}
`
