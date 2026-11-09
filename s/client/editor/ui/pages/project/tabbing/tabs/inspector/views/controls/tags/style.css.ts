
import {css} from "lit"

export default css`
.fields {
	display: grid;
	gap: 0.8em;
}

.assigned {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4em;
	padding: 0;
	margin: 0;
	list-style: none;

	&:empty {
		display: none;
	}
}

.chip {
	position: relative;
	border-radius: 5px;
	cursor: grab;

	&[data-drop="before"]::before,
	&[data-drop="after"]::after {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		border-radius: 1px;
		background: var(--prime);
		pointer-events: none;
	}

	&[data-drop="before"]::before {
		left: -4px;
	}

	&[data-drop="after"]::after {
		right: -4px;
	}

	&[data-dragging] {
		opacity: 0.5;
	}
}

wa-tag {
	background: var(--inspector-control);
	border-color: #393939;
	color: var(--inspector-text);

	&::part(content) {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
	}
}

.swatch {
	display: inline-block;
	width: 0.6em;
	height: 0.6em;
	border-radius: 50%;
	flex: none;
}

.error {
	color: #ff8f8f;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip-path: inset(50%);
}
`

