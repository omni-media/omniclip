import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		overflow: scroll;
		position: relative;
	}

	.timeline {
		display: flex;
		flex-direction: column;

		& .box-relative {
			position: relative;
		}

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
