
import {css} from "lit"

export default css`
.animation-mode {
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
}

.mode-heading {
	display: flex;
	align-items: center;
	gap: 0.45rem;
	font-size: var(--font-size-xs);
	color: #8e96a6;
	text-transform: uppercase;
	letter-spacing: 0.06em;

	&::before {
		content: "";
		width: 0;
		height: 0;
		border-top: 0.32rem solid transparent;
		border-bottom: 0.32rem solid transparent;
		border-left: 0.45rem solid var(--prime);
	}

	&.exit::before {
		border-left: 0;
		border-right: 0.45rem solid var(--prime);
	}
}

.preset-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.35rem;
}

.preset-button {
	min-width: 0;
	padding: 0.55rem 0.5rem;
	border: 1px solid transparent;
	border-radius: 5px;
	background: #1b2029;
	color: #7f8899;
	font-size: var(--font-size-xs);
	line-height: 1;
	cursor: pointer;
	transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

	&:hover {
		color: #c7d0df;
		background: #202736;
	}

	&[data-active] {
		color: #39b5e8;
		background: #0d2d3f;
		border-color: #1f6f91;
	}
}

.duration-row {
	display: grid;
	grid-template-columns: auto minmax(0, 1fr) auto;
	gap: 0.65rem;
	align-items: center;

	.duration-label,
	.duration-unit {
		color: #8e96a6;
		font-size: var(--font-size-s);
	}
}

.duration-input {
	width: 100%;
}
`

