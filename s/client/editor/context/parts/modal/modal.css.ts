
import {css} from "lit"

export default css`
	wa-dialog {
		--spacing: 0.75em;
		font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		color: #ddd;
	}

	wa-dialog::part(dialog) {
		border: 0;
		border-radius: 9px;
		background: #171717;
		box-shadow: 0 18px 60px #000b;
	}

	wa-dialog::part(header) {
		border-bottom: 1px solid #252525;
		background: #191919;
	}

	wa-dialog::part(title) {
		color: #ddd;
		font-size: var(--font-size-sm);
		font-weight: 500;
	}

	wa-dialog::part(body) {
		background: #171717;
	}

	wa-input,
	wa-select,
	wa-number-input {
		--wa-form-control-background-color: #202020;
		--wa-form-control-border-color: transparent;
		--wa-form-control-border-color-hover: transparent;
		--wa-form-control-border-color-focus: #454545;
		--wa-form-control-border-radius: 7px;
		--wa-form-control-value-color: #dedede;
		--wa-form-control-placeholder-color: #777;
	}

	wa-input::part(base),
	wa-select::part(base),
	wa-number-input::part(base) {
		min-height: 2.2em;
		font-family: inherit;
		font-size: var(--font-size-xs);
	}

	wa-dialog::part(close-button__base) {
		color: #aaa;
		background: transparent;
		border: none;
	}

	wa-dialog::part(close-button__base):hover {
		color: #eee;
		background: #292929;
		border-radius: 6px;
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
		border-radius: 6px;
		font-size: var(--font-size-xs);
	}
`
