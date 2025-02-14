import {css} from "@benev/slate"

export const styles = css`
	.playhead {
		position: absolute;
		display: flex;
		justify-content: center;
		width: 2px;
		height: 100%;
		background: var(--alpha);
		z-index: 15;
		cursor: pointer;
		touch-action: none;

		& > * {
			touch-action: none;
		}

		& .head {
			transform: rotate(180deg);
			height: 8px;
			width: 16px;
			top: 5px;
			color: var(--alpha);
			position: absolute;
		}
	}

`
