import {css} from "@benev/slate"

export const styles = css`
	:host {
		height: 25px;
	}

	.toolbar {
		display: flex;
		position: fixed;
		gap: 0.2em;
		right: 0;
		margin-right: 0.5em;
	}

	svg {
		width: 15px;
		height: 15px;
		cursor: pointer;
	}

	button[disabled] {
		opacity: 0.5;

		& svg {
			cursor: not-allowed;
		}
	}
`
