
import {css} from "lit"

export default css`
	wa-dialog {
		--spacing: 0.75em;
		--wa-color-focus: #777;
		--wa-color-surface-default: #181818;
		--wa-color-surface-raised: #1f1f1f;
		--wa-color-surface-lowered: #101010;
		--wa-color-surface-border: #303030;
		--wa-color-text-normal: #ddd;
		--wa-color-text-quiet: #8f8f8f;
		--wa-color-neutral-fill-loud: #3a3a3a;
		--wa-color-neutral-fill-normal: #303030;
		--wa-color-neutral-fill-quiet: #252525;
		--wa-color-neutral-border-loud: #555;
		--wa-color-neutral-border-normal: #3f3f3f;
		--wa-color-neutral-border-quiet: #303030;
		--wa-color-neutral-on-loud: #f0f0f0;
		--wa-color-neutral-on-normal: #e0e0e0;
		--wa-color-neutral-on-quiet: #cfcfcf;
		--wa-color-brand-fill-loud: #3a3a3a;
		--wa-color-brand-fill-normal: #2f2f2f;
		--wa-color-brand-fill-quiet: #262626;
		--wa-color-brand-border-loud: #5a5a5a;
		--wa-color-brand-border-normal: #444;
		--wa-color-brand-border-quiet: #333;
		--wa-color-brand-on-loud: #f0f0f0;
		--wa-color-brand-on-normal: #e0e0e0;
		--wa-color-brand-on-quiet: #d0d0d0;
		--wa-form-control-background-color: #232323;
		--wa-form-control-border-color: #333;
		--wa-form-control-border-radius: 3px;
		--wa-form-control-activated-color: #575757;
		--wa-form-control-value-color: #e0e0e0;
		--wa-form-control-placeholder-color: #8a8a8a;
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
