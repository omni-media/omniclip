import {css} from "@benev/slate"

export const styles = css`
	.timeline {
		display: flex;
		flex-direction: column;

		& .drop-indicator {
			height: 40px;
			outline: green dotted 2px;
			position: absolute;
			background: #0080002e;
			border-radius: 5px;
			top: 0;
		}
	}
`
