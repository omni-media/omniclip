import {css} from "@benev/slate"

export const styles = css`
	.switches {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 120px;
		background: rgb(26, 26, 26);
		border-left: 1px solid #111;

		& .items {
			display: flex;
			border-radius: 5px;
			gap: 0.7em;
			align-items: center;
			justify-content: center;

			& .index {
				font-family: Nippo-Regular;
				font-size: 0.8em;
				border-radius: 2px;
				margin-right: 0.5em;
				text-shadow: 0px -1px 0px rgba(0,0,0,.5);
				color: white;
			}
		}

		& button {
			display: flex;
			background: transparent;
			color: white;
			border: none;
			cursor: pointer;

			&[data-active] {
				color: yellow;
			}

			& svg {
				width: 12px;
			}
		}
	}
`
