import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		flex-direction: column;
		overflow: scroll;
		position: relative;
		height: 100%;
		background: var(--bg-surface, #16161e);
	}

	.timeline {
		display: flex;
		flex-direction: column;
		user-select: none;

		& .flex {
			display: flex;

			& .add-track {
				position: sticky;
				left: 0;
				z-index: 800;
				font-family: "Nippo-Regular";
				color: var(--text-tertiary, #6b6b80);
				border: 1px dashed var(--border-default, #2a2a38);
				background: var(--bg-elevated, #1e1e28);
				font-size: 0.8em;
				border-radius: 0;
				min-width: 140px;
				cursor: pointer;

				&:hover {
					border-color: var(--accent, #7c6cf0);
					background: var(--accent-muted, rgba(124, 108, 240, 0.15));
					color: var(--text-primary, #f0f0f5);
				}
			}
		}

		& .track-sidebars {
			position: sticky;
			width: 140px;
			left: 0;
			z-index: 800;
		}

		& .timeline-relative {
			height: 100%;
			width: 100%;
			position: relative;

			& * {
				will-change: transform;
			}

			& .timeline-info {
				position: fixed;
				display: flex;
				flex-direction: column;
				padding: 1.5em;
				gap: 0.2em;
				font-family: cursive;

				& h3 {
					font-size: 18px;
				}

				& p {
					font-size: 16px;
					color: var(--text-secondary, #a0a0b4);
					display: flex;
					align-items: center;
					gap: 0.3em;
				}
			}
		}

		& .transition-duration {
			position: absolute;
			z-index: 5;
			background: rgba(52,211,153,0.15);
			border-radius: 3px;
			border: 1px solid var(--color-success, #34d399);
			transition: 0.5s ease all;

			&:first-of-type {
				left: 10px;
				margin-left: -1px;
			}

			&:last-child {
				right: 10px;
				margin-right: -1px;
			}
		}

		& .transition-indicator {
			text-align: center;
			display: flex;
			background: var(--bg-elevated, #1e1e28);
			border: 1px solid var(--border-default, #2a2a38);
			border-radius: 9999px;
			color: white;
			align-items: center;
			justify-content: center;
			position: absolute;
			width: 18px;
			height: 18px;
			top: 15px;
			left: -9px;
			z-index: 2;
			opacity: 0;
			cursor: pointer;

			&[data-transition] {
				opacity: 1;
				z-index: 5;
			}

			&[data-selected] {

				& svg {
					z-index: 6;
					background: var(--color-success, #34d399);
				}
			}

			& svg {
				width: 100%;
				height: 100%;
				color: white;
				background: var(--bg-elevated, #1e1e28);
			}

			&:hover {
				opacity: 1;
				z-index: 6;
			}
		}

		& .drop-indicator {
			height: 52px;
			border: 2px dashed var(--color-success, #34d399);
			position: absolute;
			background: rgba(52,211,153,0.08);
			border-radius: 5px;
			top: 0;

			&[data-push-effects] {
				width: 10px;
				z-index: 1;
				border: 1px solid var(--color-success, #34d399);
				left: -0.5px;
			}
		}
	}
`
