
import {css} from "lit"

export default css`
.animations-panel {
	--wa-panel-border-radius: 8px;
}

.animations-panel::part(content) {
	display: flex;
	flex-direction: column;
	gap: 0.75em;
}

.keyframes-summary,
.keyframes-hint {
	font-size: var(--font-size-xs);
	color: var(--inspector-muted);
}

.keyframe-list {
	display: flex;
	flex-direction: column;
	gap: 0.4em;
}

.keyframe-property {
	display: grid;
	grid-template-columns: auto 1fr auto auto;
	align-items: center;
	gap: 0.55em;
	padding: 0.6em 0.7em;
	border: 1px solid transparent;
	border-radius: 8px;
	background: var(--inspector-surface);
	color: var(--inspector-text);
	text-align: left;
	cursor: pointer;
	transition: background 0.15s ease;

	&:hover {
		background: var(--inspector-hover);
	}

	&[data-active] {
		background: var(--inspector-active);
	}
}

.keyframe-property:focus-visible {
	outline: 2px solid var(--prime);
	outline-offset: 2px;
}

.property-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: var(--inspector-muted);
}

.property-icon svg {
	width: 0.95em;
	height: 0.95em;
	fill: currentColor;
}

.property-name {
	font-size: var(--font-size-xs);
}

.property-meta {
	font-size: calc(var(--font-size-xs) - 1px);
	color: var(--inspector-muted);
}

.keyframe-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.65em;

	& wa-button {
		font-size: var(--font-size-xs);
	}
}

.nav-buttons {
	display: flex;
	gap: 0.4em;
}
`
