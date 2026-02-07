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
		height: 52px;
		border: 1px solid var(--border-default, #2a2a38);
		border-radius: 5px;

		&[data-no-file] {
			border: 2px dashed var(--color-danger, #f04444);
			color: var(--color-danger, #f04444);
		}

		&[data-grabbed] {
			opacity: 1 !important;
			cursor: grabbing;
		}

		&[data-selected] {
			z-index: 5;
			background: rgba(255,255,255,0.06);
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
				width: 14px;
				height: 100%;
				cursor: e-resize;

				& .line {
					opacity: 0.7;
					width: 2px;
					height: 40%;
					background: var(--bg-base, #09090b);
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
		background: rgba(59,130,246,0.08);
		border-radius: 5px;
		border: 1px solid transparent;
		cursor: grab;
		position: absolute;
		top: 0;
		height: 52px;
		overflow: hidden;

		& .not-found {
			background: repeating-linear-gradient(45deg, #2a2a38, #2a2a38 10px, #3a3a4a 10px, #3a3a4a 20px);
			position: absolute;
			height: 100%;
		}

		&[data-grabbed] {
			z-index: 2;
			opacity: 0.5 !important;
		}

		&[data-selected] {
			border-color: var(--text-primary, #f0f0f5);
		}

		&[data-hidden] {
			opacity: 0.2;
		}

		&[data-selected]::after {
			outline: 2px solid rgba(255,255,255,0.6);
			outline-offset: -2px;
			content: "";
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 5px;
			box-shadow: inset 0 0 4px 1px rgba(0,0,0,0.4);
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
			border-color: var(--border-strong, #3a3a4a);
		}
	}
`
