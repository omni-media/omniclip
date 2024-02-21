import {css} from "@benev/slate"

export const styles = css`
	.effect {
		display: flex;
		z-index: 1;
		align-items: center;
		background: #201f1f;
		border-radius: 5px;
		cursor: pointer;
		position: absolute;
		top: 0;
		height: 50px;

		&[data-grabbed] {
			z-index: 2;
			opacity: 0.5;
		}

		&:hover {
			outline: 1px solid gray;
		}
	}
`


//justify-content: center;
// padding: 0.5em;
