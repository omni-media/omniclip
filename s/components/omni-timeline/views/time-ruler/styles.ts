import {css} from "@benev/slate"

export const styles = css`
	.time-ruler {
		font-size: 0.5em;
		display: flex;
		height: 20px;
		background: rgb(26, 26, 26);
		align-items: center;
		border-bottom: 2px solid #111;
	}

	.indicator {
		pointer-events: none;
		z-index: 10;
		width: 1px;
		height: 100%;
		background: yellow;
	}

	.time {
		position: absolute;
		pointer-events: none;
	}

	.dot {
		width: 3px;
		height: 3px;
		background: gray;
		border-radius: 5px;
	}

	.content {
		position: relative;
		right: 50%;
	}
`
