import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		flex-direction: column;
		align-items: start;
		width: 100%;
		height: 100%;
	}

	.settings {
		display: flex;
		gap: 1em;
		flex-direction: column;
		padding: 1em;

		& select {
			cursor: pointer;
		}
	}

	h2 {
		margin-bottom: 0.5em;
	}

	h4 {
		padding-bottom: 0.5em;
	}

	p {
		cursor: pointer;
		transition: all 0.3s ease;
	}

	p:hover {
		scale: 1.1;
		cursor: pointer;
	}

	p[data-selected] {
		font-weight: bold;
	}
`
