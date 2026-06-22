import {css} from "lit"

export const controlsStyles = css`

.controls-group {
	padding: 0.65em;
	border-bottom: 1px solid #252525;
}

.heading {
	margin: 0 0 0.65em;
	color: #8f8f8f;
	font-size: calc(var(--font-size-xs) - 1px);
	font-weight: 600;
	text-transform: uppercase;
}

wa-select,
wa-input,
wa-number-input {
	--wa-form-control-background-color: #1f1f1f;
	--wa-form-control-border-color: #303030;
	--wa-form-control-border-color-hover: #444;
	--wa-form-control-border-color-focus: #575757;
	--wa-form-control-border-radius: 3px;
	--wa-form-control-value-color: #e0e0e0;
	--wa-form-control-label-color: #aaa;
	--wa-form-control-placeholder-color: #777;
}

wa-select::part(base),
wa-input::part(base),
wa-number-input::part(base) {
	min-height: 2.15em;
	font-size: var(--font-size-xs);
}

wa-select::part(display-input),
wa-input::part(input),
wa-number-input::part(input) {
	font-size: var(--font-size-xs);
}

wa-details {
	--spacing: 0.65em;
}

wa-details::part(base) {
	border: 1px solid #292929;
	border-radius: 4px;
	background: #1b1b1b;
}

wa-details::part(header) {
	min-height: 2.4em;
	padding: 0 0.65em;
	border-bottom: 1px solid transparent;
	background: #202020;
	color: #cfcfcf;
}

wa-details::part(summary) {
	color: #cfcfcf;
	font-size: calc(var(--font-size-xs) - 1px);
	font-weight: 600;
	text-transform: uppercase;
}

wa-details[open]::part(header) {
	border-bottom-color: #292929;
}

wa-details::part(icon) {
	color: #8f8f8f;
}

wa-details::part(content) {
	background: #181818;
	color: #cfcfcf;
	font-size: var(--font-size-xs);
}

.action-row {
	display: flex;
	gap: 0.5em;
}

.advanced-panel::part(base) {
	background: #181818;
}

.advanced-panel::part(header) {
	min-height: 2.2em;
}

`

export const aiControlStyles = css`
.ai-panel {
	display: flex;
	flex-direction: column;
}

.ai-section {
	display: flex;
	flex-direction: column;
	gap: 0.65em;
	margin-bottom: 0.85em;
}

.ai-hero {
	display: flex;
	align-items: center;
	gap: 0.5em;
}

.ai-icon {
	display: flex;
	color: var(--prime);
}

.ai-description,
.muted {
	margin: 0;
	color: #8f8f8f;
	font-size: var(--font-size-xs);
}

.field-grid {
	align-items: center;
}

.field-label,
.section-label {
	color: #8f8f8f;
	font-size: var(--font-size-xs);
}

wa-button::part(base) {
	font-size: var(--font-size-xs);
}

.advanced-fields {
	display: flex;
	flex-direction: column;
	gap: 0.75em;
}

.icon-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	color: #cfcfcf;
	background: #1f1f1f;
	border: 1px solid #303030;
	border-radius: 4px;
	cursor: pointer;
}

.icon-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.status {
	min-height: 1.1em;
	color: #8f8f8f;
	font-size: var(--font-size-xs);
}

.status[data-error] {
	color: #ff8f8f;
}
`

