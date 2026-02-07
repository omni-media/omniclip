import {css} from "@benev/slate"

export const styles = css`

:host {
	display: flex;
	height: 100%;
	overflow: scroll;
}

h2 {
	display: flex;

	& svg {
		width: 20px;
	}
}

.box {
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	padding: 1em;

	& .dropdown {
		display: flex;
		flex-direction: column;

		& .flex {
			display: flex;
			align-items: center;
			margin: 1em 0;
		}
	}

	& label {
		font-size: 0.9em;
	}

	& select {
		background: var(--bg-surface, #16161e);
		border: 1px solid var(--border-default, #2a2a38);
		border-radius: 5px;
		color: var(--text-secondary, #a0a0b4);
		padding: 0.3em;

		& option {
			background: var(--bg-surface, #16161e);
		}
	}
}

.filters {
	display: flex;
	flex-wrap: wrap;
	gap: 1em;

	&[disabled] {
		pointer-events: none;
		filter: blur(1px);
		opacity: 0.4;
	}

	& .filter {
		position: relative;

		& sl-dropdown, sl-button {
			width: 100%;
		}

		& sl-menu {
			width: 200px;
			padding: 0.5em;
		}
	}

	& .options {
		display: flex;
		flex-direction: column;
		padding: 0.5em;

		& fieldset {
			display: flex;
			flex-direction: column;
			padding: 0.3em;
		}
	}

	& button {
		font-family: "Nippo-Regular";
		color: var(--text-secondary, #a0a0b4);
		border: 1px solid var(--border-default, #2a2a38);
		background: var(--bg-elevated, #1e1e28);
		font-size: 0.8em;
		border-radius: 5px;
		cursor: pointer;
		width: 100%;

		&:hover {
			background: var(--bg-overlay, #262632);
		}
	}

	& .filter-preview {
		display: flex;
		flex-direction: column;
		width: 180px;
		height: 180px;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border: 1px solid var(--border-default, #2a2a38);
		border-radius: 8px;

		& p {
			padding: 0.2em;
		}

		& canvas {
			width: 100%;
		}

		&[data-selected] {
			border-color: var(--accent, #7c6cf0);
		}
	}

	& .filter-intensity {
		display: flex;
		flex-direction: column;
		padding: 0.5em;
		gap: 0.5em;

		& input {
			cursor: pointer;
		}
	}
}
`
