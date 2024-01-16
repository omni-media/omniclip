import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		height: 50px;
	}

	.export-button {
		display: flex;
		align-items: center;
		cursor: pointer;
		background: var(--alpha);
		color: var(--bg-b);
		padding: 0.2em 0.4em;
		gap: 0.2em;
		transition: opacity 0.5s ease;

		&:hover {
			opacity: 0.8;
		}
	}

	.toolbar {
		position: absolute;
		height: 50px;
		width: 99%;
		justify-content: space-between;
		display: flex;
		align-items: center;
		gap: 0.5em;
		margin-left: 0.5em;
	}

	.zoom {
		display: flex;
		align-items: center;

		& .zoom-in, .zoom-out {
			display: flex;
		}
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
