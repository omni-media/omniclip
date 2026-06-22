
import {css} from "lit"

export default css`
	wa-dialog {
		--spacing: 0.75em;
		color: #ddd;
	}

	wa-dialog::part(dialog) {
		border: 1px solid #333;
		border-radius: 5px;
		background: #181818;
		box-shadow: 0 18px 60px #000b;
	}

	wa-dialog::part(header) {
		border-bottom: 1px solid #292929;
		background: #202020;
	}

	wa-dialog::part(title) {
		color: #ddd;
		font-size: var(--font-size-sm);
		font-weight: 500;
	}

	wa-dialog::part(body) {
		background: #181818;
	}

	wa-dialog::part(close-button__base) {
		color: #aaa;
		background: transparent;
		border: none;
	}

	wa-dialog::part(close-button__base):hover {
		color: #eee;
		background: #333;
	}

	.modal-footer {
		display: flex;
		align-items: center;
		gap: 0.5em;
		justify-content: end;
		margin-top: 0.75em;
		padding-top: 0.7em;
		border-top: 1px solid #262626;
		font-size: var(--font-size-xs);
	}

	.modal-footer wa-button::part(base) {
		min-height: 2.15em;
		border-radius: 3px;
		font-size: var(--font-size-xs);
	}
`
