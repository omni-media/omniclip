
import {css} from 'lit'

export default css`
.animations-panel {
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
}

.keyframes-summary,
.keyframes-hint {
	font-size: 0.8rem;
	color: #727b8d;
}

.keyframe-list {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.keyframe-property {
	display: grid;
	grid-template-columns: auto 1fr auto auto;
	align-items: center;
	gap: 0.6rem;
	padding: 0.45rem 0.55rem;
	border: 1px solid #2b313d;
	border-radius: 8px;
	background: #171b23;
	color: #e9eef9;
	text-align: left;
	cursor: pointer;
	transition: border-color 0.15s ease, background 0.15s ease;

	&:hover {
		border-color: #4d5c74;
		background: #1b212c;
	}

	&[data-active] {
		border-color: #8a6108;
		background: #2b2311;
	}
}

.property-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: #fbbf24;
}

.property-icon svg {
	width: 0.95rem;
	height: 0.95rem;
	fill: currentColor;
}

.property-name {
	font-size: 0.88rem;
}

.property-meta {
	font-size: 0.78rem;
	color: #8a93a5;
}

.keyframe-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
}

.nav-buttons {
	display: flex;
	gap: 0.4rem;
}
`

