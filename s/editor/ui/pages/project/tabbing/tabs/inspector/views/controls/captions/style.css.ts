
import {css} from "lit"

export default css`
.captions-panel {
	display: flex;
	flex-direction: column;
}

.section {
	display: flex;
	flex-direction: column;
	gap: 0.75em;
}

.preview, .transcribe, .text-styles {
	margin-bottom: 1.5em;
}

.caption-hero {
	display: flex;
	align-items: center;
	gap: 0.5em;
}

.caption-icon {
	display: flex;
	color: var(--prime);
}

.caption-title {
	margin: 0;
	color: #dce3f1;
	font-size: var(--font-size-m);
	font-weight: 500;
}

.caption-description,
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

.preview-list {
	display: flex;
	flex-direction: column;
	gap: 0.45em;
	max-height: 200px;
	overflow: auto;
}

.preview-row {
	display: flex;
	flex-direction: column;
	gap: 0.6em;
	align-items: start;
	padding: 0.55em 0.7em;
	background: #191e28;
	border-radius: 6px;
}

.preview-time {
	font-family: var(--font-mono, monospace);
	font-size: var(--font-size-xs);
	color: #7f8999;
}

.preview-text {
	color: #c5ccda;
	font-size: var(--font-size-s);
}

.caption-style-controls {
	display: flex;
	flex-direction: column;
	gap: 0.5em;
}
`

