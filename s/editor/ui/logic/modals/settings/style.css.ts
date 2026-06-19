import {css} from "lit"

export default css`
	.settings-modal {
		display: flex;
		flex-direction: column;
		gap: 0.65em;
	}

	.video, .audio {
		display: flex;
		flex-direction: column;
		gap: 0.25em;
		padding: 0.35em 0;
	}

	.section-label {
		margin-bottom: 0.35em;
		color: #8a8a8a;
		font-size: calc(var(--font-size-xs) - 1px);
		font-weight: 600;
		text-transform: uppercase;
	}

	.field {
		display: grid;
		grid-template-columns: 7.8em minmax(0, 1fr);
		gap: 0.65em;
		align-items: center;
		color: #b7b7b7;
		font-size: var(--font-size-xs);
	}

	.field wa-option {
		font-size: var(--font-size-xs);
	}
`

