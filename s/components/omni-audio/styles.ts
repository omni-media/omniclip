import {css} from "@benev/slate"

export const styles = css`

:host {
	display: flex;
	height: 100%;
	overflow: scroll;
}

.box {
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	gap: 0.5em;
	padding: 1em;
}

.filters {
	display: flex;
	flex-wrap: wrap;
	gap: 1em;

	& .volume-intensity {
		display: flex;
		flex-direction: column;
		padding: 0.5em;
		gap: 0.5em;

		& input {
			cursor: pointer;
		}
	}
}
`
