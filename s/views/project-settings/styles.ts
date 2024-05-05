import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	h2 {
		align-self: start;
		margin: 1em;
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
