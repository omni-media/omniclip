import {css} from "lit"

export const sectionStyles = css`

.controls-group {
	margin-bottom: 1.5em;
	padding: 1em;
	background: #2a2a2a;
	border-radius: 8px;
	border: 1px solid #333;
}

.heading {
	font-size: 0.9em;
	color: #ccc;
	margin: 0 0 1em 0;
	padding-bottom: 0.5em;
	border-bottom: 1px solid #3a3a3a;
	text-transform: uppercase;
	letter-spacing: 0.05em;
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
	gap: 0.75em;
	margin-bottom: 1.5em;
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
	color: #8e96a6;
	font-size: var(--font-size-s);
}

.field-grid {
	align-items: center;
}

.field-label,
.section-label {
	font-size: var(--font-size-s);
	color: #8e96a6;
}

wa-button::part(base) {
	background: var(--prime);
	border-color: var(--prime);
	color: #07131d;
}

.action-row {
	display: flex;
	gap: 0.5em;
}

.advanced-panel::part(base) {
	background: #161a22;
	border: 1px solid #252d3b;
	border-radius: 6px;
}

.advanced-panel::part(header) {
	color: #c5ccda;
	font-size: var(--font-size-s);
	padding: 0.5em;
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
	color: #c5ccda;
	background: #161a22;
	border: 1px solid #2d3442;
	border-radius: 6px;
	cursor: pointer;
}

.icon-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.status {
	min-height: 1.1em;
	color: #9ba5b6;
	font-size: var(--font-size-xs);
}

.status[data-error] {
	color: #ff8f8f;
}
`

