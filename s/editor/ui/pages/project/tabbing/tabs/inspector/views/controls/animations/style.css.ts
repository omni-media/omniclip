
import {css} from "lit"

export default css`
.animation-mode {
	display: flex;
	flex-direction: column;
	gap: 0.65em;
}

.mode-heading {
	display: flex;
	align-items: center;
	gap: 0.45em;
	font-size: var(--font-size-xs);
	color: #8f8f8f;
	text-transform: uppercase;

	&::before {
		content: "";
		width: 0;
		height: 0;
		border-top: 0.32em solid transparent;
		border-bottom: 0.32em solid transparent;
		border-left: 0.45em solid #888;
	}

	&.exit::before {
		border-left: 0;
		border-right: 0.45em solid #888;
	}
}

.preset-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.35em;
}

.preset-button {
	min-width: 0;
	padding: 0.55em 0.5em;
	border: 1px solid transparent;
	border-radius: 3px;
	background: #1d1d1d;
	color: #aaa;
	font-size: var(--font-size-xs);
	line-height: 1;
	cursor: pointer;
	transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

	&:hover {
		color: #e0e0e0;
		background: #242424;
	}

	&[data-active] {
		color: #f0f0f0;
		background: #252525;
		border-color: #555;
	}
}

.duration-row {
	display: grid;
	grid-template-columns: auto minmax(0, 1fr) auto;
	gap: 0.65em;
	align-items: center;

	.duration-label,
	.duration-unit {
		color: #8f8f8f;
		font-size: var(--font-size-xs);
	}
}

.duration-input {
	width: 100%;
}
`

