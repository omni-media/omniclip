
import {css} from "lit"

export default css`
.effects-panel {
	display: flex;
	flex-direction: column;
	gap: 0.75em;
}

.filter-toolbar {
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 0.65em;
	align-items: end;
}

.field {
	display: flex;
	flex-direction: column;
	gap: 0.35em;
}

.field-label,
.section-label,
.group-title {
	font-size: var(--font-size-xs);
	color: #8f8f8f;
	text-transform: uppercase;
}

.section {
	display: flex;
	flex-direction: column;
	gap: 0.65em;
}

.filter-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.5em;
}

.filter-card {
	display: flex;
	flex-direction: column;
	gap: 0.45em;
	padding: 0.55em;
	border: 1px solid #292929;
	border-radius: 4px;
	background: #1d1d1d;
	color: #d8d8d8;
	text-align: left;
	cursor: pointer;
	transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;

	&:hover {
		border-color: #4a4a4a;
		background: #242424;
	}

	&[data-active] {
		border-color: #555;
		background: #252525;
	}
}

.filter-card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5em;
}

.filter-name {
	font-size: var(--font-size-s);
	font-weight: 600;
}

.filter-tag {
	font-size: var(--font-size-xs);
	color: #8f8f8f;
}

.filter-card-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75em;
}

.toggle {
	display: flex;
	align-items: center;
	gap: 0.45em;
	font-size: var(--font-size-xs);
	color: #aaa;
}

.ghost-button,
.action-button,
.tab-button,
select,
input[type="number"],
input[type="text"] {
	background: #1f1f1f;
	color: #e0e0e0;
	border: 1px solid #303030;
	border-radius: 3px;
}

.ghost-button,
.action-button,
.tab-button {
	cursor: pointer;
}

.ghost-button {
	padding: 0.35em 0.6em;
	font-size: var(--font-size-xs);
}

.action-button {
	padding: 0.5em 0.75em;
	font-size: var(--font-size-xs);
	font-weight: 600;
}

.param-grid {
	display: flex;
	flex-direction: column;
	gap: 0.65em;
}

.param-row {
	display: flex;
	flex-direction: column;
	gap: 0.4em;
}

.param-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.65em;
}

.param-name {
	font-size: var(--font-size-xs);
	color: #cfcfcf;
}

.range-row,
.choice-row,
.boolean-row,
.color-row {
	display: flex;
	align-items: center;
	gap: 0.55em;
}

.range-row {
	& input[type="range"] {
		flex: 1;
		min-width: 0;
	}
}

wa-slider {
	flex: 1;
	min-width: 0;
}

.number-input,
.choice-select,
.text-input {
	width: 100%;
	padding: 0.45em 0.55em;
}

wa-number-input {
	&.number-input {
		width: 100%;
	}
}

wa-select {
	&.choice-select {
		width: 100%;
	}
}

wa-input {
	&.text-input {
		width: 100%;
	}
}

.number-input {
	width: 5.75em;
	text-align: right;
}

.color-input {
	width: 2.5em;
	height: 2.2em;
	padding: 0.18em;
	background: #1f1f1f;
	border: 1px solid #303030;
	border-radius: 3px;
}

.nested-group {
	display: flex;
	flex-direction: column;
	gap: 0.65em;
	padding: 0.65em;
	background: #1b1b1b;
	border: 1px solid #292929;
	border-radius: 4px;
}

.empty-state,
.muted {
	color: #8f8f8f;
	font-size: var(--font-size-xs);
}
`

