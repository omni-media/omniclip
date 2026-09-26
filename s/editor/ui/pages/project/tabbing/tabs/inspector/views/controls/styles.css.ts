import {css} from "lit"

export const controlsStyles = css`

.controls-group {
	padding: 1em 1.1em;
	border-bottom: 1px solid var(--inspector-divider);
}

.heading {
	margin: 0 0 0.9em;
	color: var(--inspector-text);
	font-size: var(--font-size-xs);
	font-weight: 600;
}

wa-select,
wa-input,
wa-number-input {
	--wa-form-control-background-color: var(--inspector-control);
	--wa-form-control-border-color: transparent;
	--wa-form-control-border-color-hover: transparent;
	--wa-form-control-border-color-focus: var(--prime);
	--wa-form-control-border-radius: 7px;
	--wa-form-control-value-color: var(--inspector-text);
	--wa-form-control-label-color: var(--inspector-muted);
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

wa-slider {
	--track-size: 3px;
	--thumb-width: 11px;
	--thumb-height: 11px;
}

wa-slider::part(track) {
	background: #252525;
}

wa-slider::part(indicator) {
	background: #3b3b3b;
}

wa-slider::part(thumb) {
	border: 0;
	background: #747474;
	box-shadow: none;
}

wa-details {
	--spacing: 0.85em;
}

wa-details::part(base) {
	border: 0;
	border-radius: 9px;
	background: var(--inspector-surface);
	overflow: hidden;
}

wa-details::part(header) {
	min-height: 2.7em;
	padding: 0 0.85em;
	border-bottom: 0;
	background: var(--inspector-surface);
	color: var(--inspector-text);
}

wa-details::part(summary) {
	color: var(--inspector-text);
	font-size: var(--font-size-xs);
	font-weight: 600;
}

wa-details[open]::part(header) {
	background: var(--inspector-hover);
}

wa-details::part(icon) {
	color: var(--inspector-muted);
}

wa-details::part(content) {
	background: var(--inspector-surface);
	color: var(--inspector-text);
	font-size: var(--font-size-xs);
}

.action-row {
	display: flex;
	gap: 0.5em;
}

.advanced-panel::part(base) {
	background: var(--inspector-surface);
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
	color: var(--inspector-muted);
	font-size: var(--font-size-xs);
}

.field-grid {
	align-items: center;
}

.field-label,
.section-label {
	color: var(--inspector-muted);
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
	color: var(--inspector-text);
	background: var(--inspector-control);
	border: 0;
	border-radius: 7px;
	cursor: pointer;
}

.icon-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.status {
	min-height: 1.1em;
	color: var(--inspector-muted);
	font-size: var(--font-size-xs);
}

.status[data-error] {
	color: #ff8f8f;
}
`
