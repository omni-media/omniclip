
import {css} from "lit"

export default css`
	.grid {
		display: grid;
		grid-template-columns: 7em minmax(0, 1fr);
		gap: 0.55em 0.75em;
		align-items: center;
		padding: 0.35em 0;
	}

	.label {
		color: #9a9a9a;
		font-size: var(--font-size-xs);
	}

	.value {
		color: #ddd;
		font-size: var(--font-size-xs);
	}

	.custom {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;

		&::part(label) {
			color: #9a9a9a;
			margin: 0;
		}
	}

	.export {
		justify-content: space-between;

		.info {
			display: flex;
			align-items: center;
			color: #aaa;
		}

		.spacer {
			display: inline-block;
			height: 15px;
			width: 1px;
			background: #383838;
			margin: 0.4em;
		}
	}

	.export > div:last-child {
		display: flex;
		gap: 0.5em;
	}
`

