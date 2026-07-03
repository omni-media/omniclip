
import {css} from "lit"

export default css`
	.roles-modal {
		width: min(42em, 82vw);
		display: flex;
		flex-direction: column;
		gap: 0.8em;
	}

	.role-section {
		display: flex;
		flex-direction: column;
		gap: 0.4em;
	}

	.section-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #aaa;
		font-size: var(--font-size-xs);
		font-weight: 600;
		text-transform: uppercase;
	}

	.role-list {
		display: flex;
		flex-direction: column;
		gap: 0.3em;
	}

	.role-row,
	.subrole-row {
		display: grid;
		grid-template-columns: 1.4em minmax(0, 1fr) auto auto;
		align-items: center;
		gap: 0.5em;
		min-height: 2.35em;
		padding: 0 0.55em;
		border-radius: 3px;
		background: color-mix(in srgb, var(--role-color), #111 28%);
		border: 1px solid color-mix(in srgb, var(--role-color), #111 48%);
	}

	.subrole-row {
		margin-left: 1.4em;
		background: color-mix(in srgb, var(--role-color), #111 45%);
	}

	.color {
		width: 0.8em;
		height: 0.8em;
		border-radius: 50%;
		background: var(--role-color);
	}

	input {
		background: transparent;
		border: 1px solid transparent;
		border-radius: 3px;
		color: #eee;
		font: inherit;
		font-size: var(--font-size-sm);
	}

	input:focus {
		outline: none;
		border-color: rgba(255, 255, 255, 0.3);
		background: rgba(0, 0, 0, 0.16);
	}

	.subrole-row input {
		font-size: var(--font-size-xs);
	}

	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.7em;
		height: 1.7em;
		padding: 0;
		color: #ddd;
		background: rgba(0, 0, 0, 0.18);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 3px;
		cursor: pointer;
	}

	.text-button {
		display: flex;
		align-items: center;
		gap: 0.35em;
		height: 1.7em;
		padding: 0 0.55em;
		color: #ddd;
		background: rgba(0, 0, 0, 0.18);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 3px;
		font-size: var(--font-size-xs);
		cursor: pointer;
	}

	.icon-button:hover,
	.text-button:hover {
		background: rgba(255, 255, 255, 0.12);
	}

	.icon-button[disabled] {
		opacity: 0.35;
		cursor: default;
	}

	.icon-button svg {
		width: 0.95em;
		height: 0.95em;
	}

	.text-button svg {
		width: 0.85em;
		height: 0.85em;
	}
`

