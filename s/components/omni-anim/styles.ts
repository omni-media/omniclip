import {css} from "@benev/slate"

export const styles = css`
	:host {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	h2 {
		display: flex;
		gap: 0.2em;

		& svg {
			width: 20px;
		}
	}

	.animations {
		display: flex;
		gap: 0.5em;
		padding: 1em;
		flex-direction: column;
		align-items: flex-start;

		& .flex {
			display: flex;
			align-items: center;
			margin: 0.5em 0;
		}

		& select {
			background: var(--bg-surface, #16161e);
			border: 1px solid var(--border-default, #2a2a38);
			border-radius: 5px;
			color: var(--text-secondary, #a0a0b4);
			padding: 0.3em;

			& option {
				background: var(--bg-surface, #16161e);
			}
		}

		& .duration-slider {
			display: flex;
			gap: 0.3em;
			align-items: center;
		}

		& .anim-cnt {
			display: flex;
			flex-wrap: wrap;

			&[disabled] {
				pointer-events: none;
				filter: blur(1px);
				opacity: 0.4;
			}
		}

		& .btn-cnt {
			display: flex;
			align-items: center;
			gap: 0.5em;

			& button {
				padding: 8px 16px;
				border-radius: 5px;
				background: var(--bg-surface, #16161e);
				border: 1px solid var(--border-default, #2a2a38);
				cursor: pointer;
				color: var(--text-secondary, #a0a0b4);

				&[data-selected] {
					border-color: var(--accent, #7c6cf0);
					background: var(--accent-muted, rgba(124, 108, 240, 0.15));
					color: var(--text-primary, #f0f0f5);
				}
			}
		}

		& .animation {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 120px;
			height: 120px;
			cursor: pointer;
			font-size: 1.5em;
			border-radius: 8px;
			margin: 8px;
			position: relative;
			border: 1px solid var(--border-default, #2a2a38);

			&[data-selected] {
				color: var(--text-primary, #f0f0f5);
				border-color: var(--accent, #7c6cf0);
				background: var(--accent-muted, rgba(124, 108, 240, 0.15));
			}

			&:hover {
				& .add-btn {
					display: flex;
				}
			}

			& .add-btn {
				margin: 0.4em;
				display: none;
				border-radius: 7px;
				position: absolute;
				bottom: 0;
				right: 0;
				cursor: pointer;

				& svg {
					width: 25px;
					height: 25px;
					opacity: 0.5;
					color: var(--color-success, #34d399);

					&:hover {
						opacity: 0.7;
					}
				}
			}
		}
	}
`
