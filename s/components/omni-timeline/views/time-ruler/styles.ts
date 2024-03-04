import {css} from "@benev/slate"

export const styles = css`
	.time-ruler {
		font-size: 0.5em;
		display: flex;
		height: 10px;
		align-items: center;
	}

	.time {
		position: absolute;
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
