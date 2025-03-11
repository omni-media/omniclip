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

		.color-cnt {
			display: flex;
			align-items: center;
			font-family: Poppins-Regular;

			& label {
				display: flex;
				width: 100px;
				font-size: 0.9rem;
			}
		}

		.color-cnt {
			align-items: baseline;
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
