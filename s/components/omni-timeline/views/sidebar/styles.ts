import {css} from "@benev/slate"

export const styles = css`
	.switches {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 140px;
		background: var(--bg-raised, #0f0f14);
		border-left: 1px solid var(--border-subtle, #1e1e28);

		& .items {
			display: flex;
			border-radius: 5px;
			gap: 0.7em;
			align-items: center;
			justify-content: center;

			& .index {
				font-family: Nippo-Regular;
				font-size: 11px;
				border-radius: 2px;
				margin-right: 0.5em;
				color: var(--text-secondary, #a0a0b4);
			}
		}

		& button {
			display: flex;
			background: transparent;
			color: var(--text-tertiary, #6b6b80);
			border: none;
			cursor: pointer;
			border-radius: 3px;
			padding: 2px;

			&:hover {
				color: var(--text-primary, #f0f0f5);
			}

			&[data-active] {
				color: var(--color-danger, #f04444);
			}

			& svg {
				width: 14px;
			}
		}
	}
`
