import {css} from "@benev/slate"

export const styles = css`

:host {
	display: flex;
	height: 100%;
	overflow: scroll;
}

h2 {
	display: flex;

	& svg {
		width: 20px;
	}
}

.box {
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	padding: 1em;

	& .dropdown {
		display: flex;
		flex-direction: column;

		& .flex {
			display: flex;
			align-items: center;
			margin: 1em 0;
		}
	}

	& label {
		font-size: 0.9em;
	}

	& select {
		background: #111;
		border-radius: 5px;
		color: gray;
		padding: 0.3em;

		& option {
			background: #111;
		}
	}
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
		flex-direction: column;
		width: 200px;
		background: black;
		border-radius: 10px;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border: 1px solid #373535;

		& p {
			padding: 0.2em;
		}

		& canvas {
			border-top-right-radius: 10px;
			border-top-left-radius: 10px;
		}

		&[data-selected] {
			border: 2px solid white;
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
