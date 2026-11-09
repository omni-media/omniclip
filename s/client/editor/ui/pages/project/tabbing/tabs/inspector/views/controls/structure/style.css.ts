
import {css} from "lit"

export default css`
.fields {
	display: grid;
	gap: 0.8em;
}

.error {
	margin: 0;
	color: #ff8f8f;
	font-size: var(--font-size-xs);
}

.rule-label {
	color: var(--inspector-muted);
	font-size: var(--font-size-xs);
}

.library {
	display: block;

	> wa-button {
		width: 100%;

		&::part(button) {
			width: 100%;
			justify-content: space-between;
		}
	}

	&::part(menu) {
		max-height: 16em;
		overflow: auto;
	}
}

wa-button {
	&::part(button) {
		font-size: var(--font-size-xs);
	}

	&:not([appearance="plain"]) {
		&::part(button) {
			background: #242424;
			border-color: #343434;
			color: #ddd;
			box-shadow: none;
		}

		&:hover::part(button) {
			background: #303030;
		}
	}

	&[appearance="plain"]::part(button) {
		color: #999;
	}
}

.rule-actions {
	display: flex;
	align-items: center;
	gap: 0.25em;

	svg {
		display: block;
		width: 16px;
		height: 16px;
	}
}

.rule-delete {
	&::part(button) {
		min-width: 2em;
		padding-inline: 0.35em;
	}

	&:hover::part(button) {
		color: #cf8989;
	}
}
`

