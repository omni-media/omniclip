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

		& .example {
			background: black;
			font-size: 1.5em;
			border-radius: 5px;
			margin: 1em;
			padding: 3em 2em;
			position: relative;
			
			&:hover {
				& .add-btn {
					display: flex;
				}
			}

			& .add-btn {
				margin: 0.4em;
				display: none;
				border-radius: 7px;
				position: absolute;
				bottom: 0;
				right: 0;
				cursor: pointer;

				& svg {
					width: 25px;
					height: 25px;
					opacity: 0.5;
					color: lime;

					&:hover {
						opacity: 0.7;
					}
				}
			}
		}
	}
`
