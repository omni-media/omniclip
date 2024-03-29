import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		min-height: 50px;
		--transition: 0.25s;
	}

	.toolbar {
		width: 99%;
		justify-content: space-between;
		display: flex;
		align-items: center;
		gap: 0.5em;
		margin-left: 0.5em;
	}

	.tools {
		z-index: 2;
		display: flex;
		position: fixed;
		align-items: center;
		width: 98%;
		justify-content: space-between;
	}

	.history {
		display: flex;
		fill: #555454;

		& svg {
			cursor: default;
		}

		& button[data-past], button[data-future] {
			fill: #989898;

			& svg {
				cursor: pointer;
			}
		}

		& .split {
			color: #555454;
			margin-left: 50%;

			& svg {
				width: 17px;
			}
		}
	}

	.zoom {
		display: flex;
		align-items: center;

		& .zoom-in, .zoom-out {
			display: flex;
			color: #989898;
		}
	}

	svg {
		width: 20px;
		height: 20px;
		cursor: pointer;
	}

	button[disabled] {
		opacity: 0.5;

		& svg {
			cursor: not-allowed;
		}
	}
`
