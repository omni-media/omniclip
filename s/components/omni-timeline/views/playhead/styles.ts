import {css} from "@benev/slate"

export const styles = css`
	.playhead {
		position: absolute;
		display: flex;
		justify-content: center;
		width: 1px;
		height: 100%;
		background: green;
		z-index: 3;

		& .head {
			position: absolute;
			width: 10px;
			height: 5px;
			background: green;
		}
	}
`
