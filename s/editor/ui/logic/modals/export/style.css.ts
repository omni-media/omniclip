
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

	.export-button {
		margin-top: 0.35rem;
		width: 100%;
	}
`
