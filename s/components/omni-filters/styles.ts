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

	&[disabled] {
		pointer-events: none;
		filter: blur(2px);
		opacity: 0.5;
	}

	& .filter {
		display: flex;
		border-radius: 5px;
		width: 200px;
		height: 200px;
		background: black;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border: 1px solid #373535;

		&[data-selected] {
			border: 2px solid gray;
		}
	}

	& .filter-intensity {
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
