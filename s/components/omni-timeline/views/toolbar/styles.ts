import {css} from "@benev/slate"

export const styles = css`
	:host {
		position: sticky;
		top: 0;
		left: 0;
		z-index: 801;
		display: flex;
		min-height: 40px;
	}

	.toolbar {
		justify-content: space-between;
		display: flex;
		align-items: center;
		gap: 0.5em;
		width: 100%;
	}

	.tools {
		height: 40px;
		background: var(--bg-raised, #0f0f14);
		border-bottom: 1px solid var(--border-subtle, #1e1e28);
		z-index: 100;
		width: 100%;
		display: flex;
		padding: 0 12px;
		align-items: center;
		justify-content: space-between;

		& .time {
			font-family: Nippo-Regular;
			font-size: 12px;
			color: var(--text-primary, #f0f0f5);
		}

		& button {
			cursor: pointer;
			background: transparent;
			border: none;
			border-radius: 3px;
			padding: 4px;
			color: var(--text-secondary, #a0a0b4);
			display: flex;
			align-items: center;

			&:hover {
				color: var(--text-primary, #f0f0f5);
				background: var(--bg-elevated, #1e1e28);
			}
		}

		& .clean {
			display: flex;
			color: var(--color-danger, #f04444);
		}

		& .flex {
			display: flex;
			align-items: center;
			gap: 1em;

			& .split, .remove {
				display: flex;
				align-items: center;

				& svg {
					width: 17px;
				}
			}
		}
	}

	.history {
		display: flex;
		fill: var(--text-disabled, #45455a);

		& button {
			display: flex;
			align-items: center;
		}

		& button[data-past], button[data-future] {
			fill: var(--text-secondary, #a0a0b4);
		}

	}

	.zoom {
		display: flex;
		align-items: center;

		& .zoom-in, .zoom-out {
			display: flex;
			color: var(--text-secondary, #a0a0b4);
		}
	}

	svg {
		width: 16px;
		height: 16px;
	}

	button[disabled] {
		opacity: 0.3;
		cursor: default;
	}
`
