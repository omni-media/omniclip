import {css} from "@benev/slate"

export const styles = css`
	.track {
		display: flex;
		position: relative;
		height: 52px;
		background: var(--bg-surface, #16161e);
		outline: 1px solid var(--border-subtle, #1e1e28);

		&[data-locked] {
			background: repeating-linear-gradient(45deg, #2a2a38, #2a2a38 10px, #3a3a4a 10px, #3a3a4a 20px);
			z-index: 10;
			opacity: 0.4;
		}

		&[data-hidden] {
			opacity: 0.15;
		}
	}

	.indicators {
		width: 100%;
		position: relative;

		& .indicator-area {
			position: absolute;
			width: 100%;
			height: 12px;
			top: -6px;
			z-index: 10;

			&[data-indicate] {
				cursor: grabbing;
			}
		}

		& .indicator {
			display: none;
			z-index: 1;
			position: relative;
			align-items: center;
			width: 100%;
			outline: 1px solid var(--color-success, #34d399);

			&[data-indicate] {
				display: flex;
				background: rgba(52,211,153,0.08);
			}
		}
	}
`
