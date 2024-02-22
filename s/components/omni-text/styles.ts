import {css} from "@benev/slate"

export const styles = css`
	:host {}

	.text-selector {
		display: flex;
		flex-direction: column;
		gap: 0.3em;
		padding: 1em;
		height: 200px;
		
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


		& .color-picker {
			display: flex;
			gap: 0.5em;
			padding: 0.5em;

			& span {
				font-weight: bold;
				width: 65px;
			}

			& .picker {
				width: 25px;
				height: 25px;
				border-radius: 100%;
				background: blue;
				cursor: pointer;
				
				&::-webkit-color-swatch {
					border: none;
				}
			}
		}
	}
	
	h2 {
		padding: 0.3em;
	}

	.not-selected {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
		font-size: 1.5em;
	}

	.add-text {
		padding: 0.5em;
		margin: 1em;
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
`
