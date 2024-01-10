import {css} from "@benev/slate"

export const styles = css`
	:host {}

	.text-selector {
		display: flex;
		flex-direction: column;
		gap: 0.3em;
		padding: 0.3em;
		
		& [data-selected] {
			background: rgb(32, 31, 31);
		}
		
		& .flex-column {
			display: flex;
			flex-direction: column;
			gap: 0.3em;
		}

		& .flex {
			display: flex;
			align-items: center;
		}

		& .flex-hover {
			display: flex;
			gap: 0.3em;

			& > * {
				display: flex;
				padding: 0.2em;
				border-radius: 5px;
				cursor: pointer;

				&:hover {
					outline: 1px solid #FFFFFF88;
				}

			}
		}

		& label {
			font-weight: bold;
		}

		& select {
			background: rgb(32, 31, 31);
			border: none;
			padding: 0.5em;
			border-radius: 5px;
			color: inherit;
			width: 80%;
			cursor: pointer;
		}

		& svg {
			padding: 0.2em;
			width: 30px;
			height: 30px;
		}

		& .font-size {
			background: rgb(32, 31, 31);
			border: none;
			border-radius: 5px;
			padding: 0.5em;
			color: inherit;
			width: 20%;
			text-align: center;
		}

		& .add-text {
			padding: 0.5em;
			background: rgb(32, 31, 31);
			margin-top: 1em;
			cursor: pointer;
			transition: all 0.3s ease;
			font-weight: bold;

			&:hover {
				opacity: 0.7;
				color: white;
			}
		}

		& .color-picker {
			display: flex;
			gap: 0.5em;
			& span {
				font-weight: bold;
			}
			& .picker {
				width: 40px;
				height: 40px;
				border: 1px solid gray;
				border-radius: 5px;
				background: blue;
			}
		}
	}
`
