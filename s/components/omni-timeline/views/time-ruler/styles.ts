import {css} from "@benev/slate"

export const styles = css`
	:host {
		width: 100%;
	}

	.time-ruler {
		font-size: 11px;
		display: flex;
		height: 24px;
		background: var(--bg-raised, #0f0f14);
		border-bottom: 1px solid var(--border-subtle, #1e1e28);
		align-items: center;
		color: var(--text-tertiary, #6b6b80);
	}

	.indicator {
		pointer-events: none;
		z-index: 10;
		width: 1px;
		height: 100%;
		background: var(--color-danger, #f04444);
	}

	.time {
		position: absolute;
		pointer-events: none;
	}

	.dot {
		width: 2px;
		height: 2px;
		background: var(--text-tertiary, #6b6b80);
		border-radius: 5px;
	}

	.content {
		position: relative;
		right: 50%;
	}
`
