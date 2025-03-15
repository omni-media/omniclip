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
		position: relative;

		& sl-dropdown, sl-button {
			width: 100%;
		}

		& sl-menu {
			width: 200px;
			padding: 0.5em;
		}
	}

	& .options {
		display: flex;
		flex-direction: column;
		padding: 0.5em;

		& fieldset {
			display: flex;
			flex-direction: column;
			padding: 0.3em;
		}
	}

	& button {
		font-family: "Nippo-Regular";
		color: #fff;
		border: 1px solid #111;
		background-image: -webkit-gradient(
				linear,
				left bottom,
				left top,
				color-stop(0, rgb(48,48,48)),
				color-stop(1, rgb(102, 102, 102))
		);
		text-shadow: 0px -1px 0px rgba(0,0,0,.5);
		font-size: 0.8em;
		border-radius: 0;
		cursor: pointer;
		width: 100%;
	}

	& .filter-preview {
		display: flex;
		flex-direction: column;
		width: 200px;
		height: 200px;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border: 1px solid #373535;
		border-radius: 5px;

		& p {
			padding: 0.2em;
		}

		& canvas {
			width: 100%;
		}

		&[data-selected] {
			border: 1px solid white;
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
