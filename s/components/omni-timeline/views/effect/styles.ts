import {css} from "@benev/slate"

export const styles = css`
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
		
		& .trim-handle-right, .trim-handle-left {
			display: none;
		}
		
		&[data-selected] {
			& .trim-handle-right, & .trim-handle-left {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 3px;
				z-index: 1;
				position: absolute;
				background: white;
				width: 18px;
				height: 100%;
				cursor: e-resize;

				& .line {
					width: 3px;
					height: 40%;
					background: #333;
					border-radius: 5px;
				}
			}

			& .trim-handle-left {
				left: 0;
				border-top-left-radius: 5px;
				border-bottom-left-radius: 5px;
			}

			& .trim-handle-right {
				right: 0;
				border-top-right-radius: 5px;
				border-bottom-right-radius: 5px;
			}
		}

		&[data-grabbed] {
			z-index: 2;
			opacity: 0.5;
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


//justify-content: center;
// padding: 0.5em;
