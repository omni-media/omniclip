import {css} from "lit"

export default css`
	.settings-modal {
		display: flex;
		flex-direction: column;
		gap: 0.65em;
	}

	.video, .audio, .model-storage {
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

	.model-storage {
		gap: 0.5em;
		border-top: 1px solid #292929;
		padding-top: 0.8em;
	}

	.model-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		gap: 0.65em;
		align-items: center;
		min-height: 2.2em;
		color: #ccc;
		font-size: var(--font-size-xs);
	}

	.model-size, .storage-status, .storage-summary {
		color: #8f8f8f;
	}

	.model-name {
		display: flex;
		flex-direction: column;
		gap: 0.15em;
	}

	.model-name small {
		color: #777;
		font-size: calc(var(--font-size-xs) - 1px);
	}

	.model-row wa-button::part(base) {
		min-height: 1.9em;
		font-size: var(--font-size-xs);
	}

	.storage-status, .storage-summary {
		font-size: var(--font-size-xs);
	}

	.storage-status.error {
		color: #d77;
	}

	.storage-summary {
		display: flex;
		justify-content: space-between;
		gap: 1em;
		margin-top: 0.4em;
		padding-top: 0.55em;
		border-top: 1px solid #252525;
	}
`
