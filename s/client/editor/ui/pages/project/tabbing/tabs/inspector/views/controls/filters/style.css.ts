
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
	color: var(--inspector-muted);
}

.section {
	display: flex;
	flex-direction: column;
	gap: 0.65em;
}

.filter-grid {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 0.4em;
}

.filter-card {
	display: flex;
	align-items: center;
	gap: 0.6em;
	min-width: 0;
	padding: 0.4em 0.55em;
	border: 0;
	border-radius: 7px;
	background: var(--inspector-surface);
	color: var(--inspector-text);
	transition: background 0.15s ease, color 0.15s ease;
	cursor: default;

	&:hover {
		background: #1c1c1c;
	}

	&[data-active] {
		background: #202020;
	}
}

.filter-card[data-selectable] {
	cursor: pointer;
}

.ghost-button:focus-visible,
.action-button:focus-visible,
.tab-button:focus-visible {
	outline: 2px solid var(--prime);
	outline-offset: 2px;
}

.filter-card-header {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: space-between;
	gap: 0.5em;
	min-width: 0;
	padding: 0;
	color: inherit;
}

.filter-name {
	font-size: var(--font-size-s);
	font-weight: 600;
}

.filter-tag {
	font-size: var(--font-size-xs);
	color: var(--inspector-muted);
}

.filter-card-actions {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 0.4em;
}

.toggle {
	display: flex;
	align-items: center;
	gap: 0.45em;
	font-size: var(--font-size-xs);
	color: var(--inspector-muted);
}

.ghost-button,
.action-button,
.tab-button,
select,
input[type="number"],
input[type="text"] {
	background: var(--inspector-control);
	color: var(--inspector-text);
	border: 1px solid transparent;
	border-radius: 7px;
}

.ghost-button,
.action-button,
.tab-button {
	cursor: pointer;
}

.ghost-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.8em;
	height: 1.8em;
	padding: 0;
	background: transparent;
	color: var(--inspector-muted);
}

.ghost-button:hover {
	background: #292929;
	color: var(--inspector-text);
}

.ghost-button wa-icon {
	font-size: 0.85em;
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
	color: var(--inspector-text);
}

.range-row,
.choice-row,
.boolean-row,
.color-row {
	display: flex;
	align-items: center;
	gap: 0.55em;
	min-width: 0;
}

.range-row {
	& input[type="range"] {
		flex: 1;
	}
}

wa-slider {
	flex: 1;
	min-width: 0;
}

.number-input,
.choice-select,
.text-input {
	flex: 1;
	min-width: 0;
	width: 100%;
}

.number-input {
	width: 5.75em;
	text-align: right;
}

.nested-group {
	display: flex;
	flex-direction: column;
	gap: 0.65em;
	padding: 0.8em;
	background: var(--inspector-surface);
	border: 0;
	border-radius: 8px;
}

.empty-state,
.muted {
	color: var(--inspector-muted);
	font-size: var(--font-size-xs);
}
`
