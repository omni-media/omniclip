
import {css} from "lit"

export default css`
	.export-modal {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-width: 24rem;
	}

	.grid {
		display: grid;
		grid-template-columns: 5.5rem minmax(0, 1fr);
		gap: 0.7rem 0.8rem;
		align-items: center;
	}

	.label {
		color: #747e92;
		font-size: var(--font-size-s);
	}

	.value {
		color: #d8deea;
		font-size: 0.95rem;
	}

	.custom {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;
    font-size: var(--font-size-s);

		&::part(label) {
			color: #747e92;
			margin: 0;
		}
	}

	.export {
		margin-top: 2em;
		align-items: end;
		justify-content: space-between;
		font-size: var(--font-size-xs);

		.info {
			display: flex;
			align-items: center;
			color: #d8deea;
		}

		.spacer {
			display: inline-block;
			height: 15px;
			width: 1px;
			background: #747e92;
			margin: 0.4em;
		}
	}

	.export-button, .cancel {
		margin-top: 0.35rem;
		font-size: var(--font-size-xs);
	}
`
