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

	.settings {
		display: flex;
		gap: 1em;
		flex-direction: column;
		padding: 1em;

		& .bitrate {
			background: transparent;
			border: 1px solid gray;
			border-radius: 5px;
			padding: 0.2em;
			color: gray;
		}

		& .timebases {
			display: flex;
			gap: 0.5em;
			flex-wrap: wrap;

			& .timebase {
				border: 1px solid gray;
				border-radius: 5px;
				padding: 0.1em 0.5em;
				cursor: pointer;
				font-size: 0.9em;

				&[data-selected] {
					border-color: white;
					color: white;
				}
			}
		}

		& .resolutions {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5em;

			& p {
				border: 1px solid gray;
				padding: 0.2em 1em;
				border-radius: 5px;
				font-size: 0.9em;

				&[data-selected] {
					color: white;
					border-color: white;
				}
			}
		}

		& .aspect-ratios {
			display: flex;
			gap: 1em;
			flex-wrap: wrap;

			& .cnt {
				display: flex;
				align-self: end;
				max-width: 100px;
				width: 100%;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				text-align: center;
				gap: 0.3em;
				color: gray;
				cursor: pointer;

				& .aspect-ratio {
					font-size: 0.9em;
				}

				& .info {
					font-size: 0.8em;
				}

				&[data-selected] {
					color: white;
				}

				& .shape {
					height: 50px;
					border-radius: 5px;
					border: 1px solid;
					margin-bottom: 0.5em;
				}
			}
		}

		& select {
			cursor: pointer;
		}
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
