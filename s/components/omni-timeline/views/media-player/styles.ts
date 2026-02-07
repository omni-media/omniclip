import {css} from "@benev/slate"

export const styles = css`
	:host {}

	.flex {
		display: flex;
		justify-content: center;
		height: 100%;
		width: 100%;
		flex-direction: column;
	}

	.project-name {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5em;

		& .box {
			display: flex;
			align-items: center;
			border: 1px solid;
			border-radius: 10px;

			& .icons {
				display: flex;
				cursor: pointer;

				& .check {
					display: flex;
					color: var(--color-success, #34d399);
				}
			}

			& input {
				background: none;
				border: none;
				padding: 0.5em;
				color: var(--text-secondary, #a0a0b4);

				&:not(:disabled) {
					color: white;
				}
			}

			& svg {
				margin: 0.5em;
			}
		}
	}

	canvas {
		height: 100% !important;
		width: 100% !important;
	}

	.lower-canvas {
		background: var(--bg-raised, #0f0f14);
	}

	.canvas-container {
		position: relative;
		aspect-ratio: 16/9;
		height: 100%;
	}

	.upper-canvas {
		z-index: 100;
	}

	figure {
		position: relative;
		overflow: hidden;
		aspect-ratio: 16/9;
		display: flex;
		justify-content: center;
		border-radius: 5px;
	}

	video {
		width: 100%;
	}

	.controls {
		display: flex;
		justify-content: center;
		width: 100%;
		margin: 0.5em 0;
		z-index: 999;

		& button {
			display: flex;
			align-items: center;
			background: transparent;
			color: var(--text-secondary, #a0a0b4);
			border: none;
			border-radius: 3px;
			cursor: pointer;

			&:hover {
				color: var(--text-primary, #f0f0f5);
			}
		}

		& .fs {
			position: absolute;
			right: 1em;
		}
	}

	.controls[data-state="hidden"] {
		display: none;
	}

	.controls[data-state="visible"] {
		display: block;
	}

	.controls > *:first-child {
		margin-left: 0;
	}

	.controls .progress {
		cursor: pointer;
		width: 75.390625%;
	}

	.controls button {
		border: none;
		cursor: pointer;
		background: transparent;
		background-size: contain;
		background-repeat: no-repeat;
		display: flex;
		justify-content: center;
	}

	.controls button:hover,
	.controls button:focus {
		opacity: 0.5;
	}

	.controls button[data-state="play"] {
		background-image: url("data:image/png;base64,iVBORw0KGgoAAA…");
	}

	.controls button[data-state="pause"] {
		background-image: url("data:image/png;base64,iVBORw0KGgoAAA…");
	}

	.controls progress {
		display: block;
		width: 100%;
		height: 81%;
		margin-top: 0.125rem;
		border: none;
		color: var(--accent, #7c6cf0);
		-moz-border-radius: 2px;
		-webkit-border-radius: 2px;
		border-radius: 2px;
	}

	.controls progress::-moz-progress-bar {
		background-color: var(--accent, #7c6cf0);
	}

	.controls progress::-webkit-progress-value {
		background-color: var(--accent, #7c6cf0);
	}
`
