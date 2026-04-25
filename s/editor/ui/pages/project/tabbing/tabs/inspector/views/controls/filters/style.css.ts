
import {css} from "lit"

export default css`
.effects-panel {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.filter-toolbar {
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 0.75rem;
	align-items: end;
}

.field {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
}

.field-label,
.section-label,
.group-title {
	font-size: var(--font-size-xs);
	color: #8e96a6;
	text-transform: uppercase;
	letter-spacing: 0.06em;
}

.section {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.filter-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.6rem;
}

.filter-card {
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
	padding: 0.75rem;
	border: 1px solid #2e3746;
	border-radius: 8px;
	background: #181c24;
	color: #dce3f1;
	text-align: left;
	cursor: pointer;
	transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;

	&:hover {
		border-color: #46627e;
		background: #1b2230;
	}

	&[data-active] {
		border-color: var(--prime);
		background: #122838;
	}
}

.filter-card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
}

.filter-name {
	font-size: var(--font-size-s);
	font-weight: 600;
}

.filter-tag {
	font-size: var(--font-size-xs);
	color: #8e96a6;
}

.filter-card-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
}

.toggle {
	display: flex;
	align-items: center;
	gap: 0.45rem;
	font-size: var(--font-size-s);
	color: #b8c0d0;
}

.ghost-button,
.action-button,
.tab-button,
select,
input[type="number"],
input[type="text"] {
	background: #161a22;
	color: #edf2ff;
	border: 1px solid #2d3442;
	border-radius: 6px;
}

.ghost-button,
.action-button,
.tab-button {
	cursor: pointer;
}

.ghost-button {
	padding: 0.35rem 0.6rem;
	font-size: var(--font-size-xs);
}

.action-button {
	padding: 0.55rem 0.8rem;
	font-size: var(--font-size-s);
	font-weight: 600;
}

.param-grid {
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
}

.param-row {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.param-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
}

.param-name {
	font-size: var(--font-size-s);
	color: #d2d9e7;
}

.range-row,
.choice-row,
.boolean-row,
.color-row {
	display: flex;
	align-items: center;
	gap: 0.6rem;
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
	padding: 0.45rem 0.55rem;
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
	width: 5.75rem;
	text-align: right;
}

.color-input {
	width: 2.5rem;
	height: 2.2rem;
	padding: 0.18rem;
	background: #161a22;
	border: 1px solid #2d3442;
	border-radius: 6px;
}

.nested-group {
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
	padding: 0.8rem;
	background: #131720;
	border: 1px solid #252c39;
	border-radius: 8px;
}

.empty-state,
.muted {
	color: #8e96a6;
	font-size: var(--font-size-s);
}
`

