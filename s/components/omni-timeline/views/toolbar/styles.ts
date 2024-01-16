import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		height: 50px;
	}

	dialog {
		width: 100%;
		height: 100%;
		background: none;
		backdrop-filter: blur(5px);
		border: none;
		margin: auto;

		& .box {
			display: flex;
			width: 100%;
			height: 100%;
			justify-content: center;
			align-items: center;
			gap: 0.5em;

			canvas {
				width: 500px;
				height: 300px;
				background: var(--bg-a);
			}

			& .flex-col {
				display: flex;
				flex-direction: column;
				height: 300px;
				justify-content: space-between;
				background: var(--bg-a);
				padding: 1em;

				& .progress {
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				& span {
					color: white;
					font-size: 2em;
				}
			}

			& .download {
				background: #FFFF00;
				padding: 0.2em 0.4em;
				transition: opacity 0.5s ease;
				cursor: pointer;
				font-size: 2em;

				&[disabled] {
					cursor: progress;
				}
			}
		}
	}

	.export-button {
		display: flex;
		align-items: center;
		cursor: pointer;
		background: var(--alpha);
		color: var(--bg-b);
		padding: 0.2em 0.4em;
		gap: 0.2em;
		transition: opacity 0.5s ease;

		&:hover {
			opacity: 0.8;
		}
	}

	.toolbar {
		position: absolute;
		height: 50px;
		width: 99%;
		justify-content: space-between;
		display: flex;
		align-items: center;
		gap: 0.5em;
		margin-left: 0.5em;
	}

	.zoom {
		display: flex;
		align-items: center;

		& .zoom-in, .zoom-out {
			display: flex;
		}
	}

	svg {
		width: 15px;
		height: 15px;
		cursor: pointer;
	}

	button[disabled] {
		opacity: 0.5;

		& svg {
			cursor: not-allowed;
		}
	}
`
