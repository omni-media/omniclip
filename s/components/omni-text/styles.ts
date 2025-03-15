import {css} from "@benev/slate"

export const styles = css`
	:host {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	.examples {
		display: flex;
		flex-direction: column;
		margin: 1em;
		gap: 1em;

		& .styles {
			display: flex;
			flex-direction: column;
			gap: 0.5em;

			& .flex {
				display: flex;
				align-items: center;
			}
		}

		& .select-text {
			display: flex;
		}

		& .add-text {
			width: 100%;
			padding: 0.5em 1em 0em 1em;
		}

		& .cnt {
			display: flex;
			flex-direction: column;
			gap: 0.5em;

			& sl-input, sl-select {
				display: flex;
			}
		}

		& .pick-color {
			display: flex;
			align-items: center;
			gap: 0.5em;
		}

		& .stops-cnt {
			& .flex {
				align-items: center;
			}
		}

		& .colors-cnt, .stops-cnt {
			display: flex;
			align-items: center;
			font-family: Poppins-Regular;
			align-items: baseline;
			cursor: pointer;

			& .flex {
				display: flex;
				align-items: end;
			}

			& label {
				display: flex;
				width: 100px;
				font-size: 0.9rem;
			}
		}

		& .font-styles {
			display: flex;
			flex-direction: column;
			gap: 0.7em;
			margin-bottom: 1em;
		}

		& select, input {
			max-width: 150px;
			width: 100%;
		}

		& .add-stop-btn, .add-color-btn {
			margin-top: 0.5rem;
		}

		& .example {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			height: 150px;
			width: 150px;
			background: black;
			font-size: 1.5em;
			border-radius: 5px;
			margin: 1em;
			color: white;

			& .add-btn {
				margin: 0.4em;
				border-radius: 7px;
				position: absolute;
				bottom: 0;
				right: 0;
				cursor: pointer;

				& svg {
					width: 25px;
					height: 25px;
					opacity: 0.5;
					color: white;

					&:hover {
						opacity: 0.8;
					}
				}
			}
		}
	}
`
