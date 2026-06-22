
import {css} from 'lit'

export default css`
.animations-panel {
	display: flex;
	flex-direction: column;
	gap: 0.75em;
}

.keyframes-summary,
.keyframes-hint {
	font-size: var(--font-size-xs);
	color: #8f8f8f;
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
	padding: 0.45em 0.55em;
	border: 1px solid #292929;
	border-radius: 4px;
	background: #1d1d1d;
	color: #d8d8d8;
	text-align: left;
	cursor: pointer;
	transition: border-color 0.15s ease, background 0.15s ease;

	&:hover {
		border-color: #4a4a4a;
		background: #242424;
	}

	&[data-active] {
		border-color: #555;
		background: #252525;
	}
}

.property-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: #b8b8b8;
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
	color: #8f8f8f;
}

.keyframe-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.65em;
}

.nav-buttons {
	display: flex;
	gap: 0.4em;
}
`

