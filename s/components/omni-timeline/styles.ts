import {css} from "@benev/slate"

export const styles = css`
	.timeline {
		display: flex;
		flex-direction: column;
		gap: 0.5em;

		& .track {
			background: black;
			display: flex;

			& .track-item {
				padding: 0.5em;
			}
		}
	}
`
