import {css} from "@benev/slate"

export const styles = css`
	.playhead {
		position: absolute;
		display: flex;
		justify-content: center;
		width: 2px;
		height: 100%;
		background: var(--alpha);
		z-index: 3;
		cursor: pointer;

		& .head {
			transform: rotate(180deg);
			background: var(--alpha);
			display: inline-block;
			height: 10px;
			position: relative;
			width: 20px;
			position: absolute;

			&:before {
				border-bottom: 10px solid var(--alpha);
				border-left: 10px solid transparent;
				border-right: 10px solid transparent;
				content: "";
				height: 0;
				left: 0;
				position: absolute;
				top: -10px;
				width: 0;
			}
		}
	}
`
