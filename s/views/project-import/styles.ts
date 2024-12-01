import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		flex-direction: column;
		align-items: start;
		width: 100%;
		height: 100%;
		overflow-y: scroll;
	}

	.importProject{
            
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
`
