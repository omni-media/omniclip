import {css} from "@benev/slate"

export const styles = css`
	.effect {
		display: flex;
		z-index: 1;
		align-items: center;
		justify-content: center;
		padding: 0.5em;
		background: #201f1f;
		border-radius: 5px;
		border: 1px solid #181818;
		cursor: pointer;
		position: absolute;
		top: 0;
		height: 40px;

		&[data-grabbed] {
			z-index: 2;
			opacity: 0.5;
		}
	}
`
