import {css} from "lit"

export default css`
	.shortcuts-modal {
		display: flex;
		flex-direction: column;
		height: min(39em, calc(100vh - 7em));
	}

	.toolbar, .tabs, .footer {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #ffffff14;
	}

	.toolbar {
		gap: 0.75em;
		padding: 0.75em;
	}

	.search {
		flex: 1;
		min-width: 12em;
	}

	.search wa-input {
		width: 100%;
	}

	wa-button::part(base) {
		font-size: var(--font-size-xs);
	}

	.replace::part(base) {
		background: #b63b3b;
		border-color: #b63b3b;
	}

	.chip-button {
		border: 0;
		border-radius: 4px;
		font: inherit;
		cursor: pointer;
	}

	.tabs {
		display: block;
		background: #1b1b1b;
		--track-color: #ffffff14;
		--indicator-color: #7fb1ff;
	}

	.tabs::part(base) {
		border-bottom: 1px solid #ffffff14;
	}

	.tabs::part(body) {
		display: none;
	}

	wa-tab::part(base) {
		font-size: var(--font-size-xs);
	}

	.list {
		flex: 1;
		overflow: auto;
		padding: 0.5em;
	}

	.group {
		margin-bottom: 0.85em;
	}

	.group-label {
		position: sticky;
		top: -0.5em;
		z-index: 1;
		padding: 0.35em 0.5em;
		background: #181818;
		color: #888;
		font-size: calc(var(--font-size-xs) - 1px);
		font-weight: 600;
		text-transform: uppercase;
	}

	.rows {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: grid;
		grid-template-columns: minmax(10em, 1fr) auto;
		gap: 0.75em;
		align-items: center;
		min-height: 2.6em;
		padding: 0.45em 0.5em;
		border-top: 1px solid #ffffff0d;
		border-radius: 4px;
	}

	.row:hover {
		background: #ffffff08;
	}

	.row[data-editing] {
		background: #1c2940;
		outline: 1px solid #6aa6ff80;
	}

	.command {
		min-width: 0;
	}

	.command-name {
		display: flex;
		gap: 0.45em;
		align-items: center;
		min-width: 0;
		color: #eee;
		font-size: var(--font-size-xs);
	}

	.command-name span:first-child {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.custom {
		color: #91d8a8;
		font-size: calc(var(--font-size-xs) - 2px);
		font-weight: 600;
		text-transform: uppercase;
	}

	.description {
		margin-top: 0.12em;
		overflow: hidden;
		color: #888;
		font-size: calc(var(--font-size-xs) - 1px);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.binding, .editing {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 0.5em;
	}

	.editing {
		flex-wrap: wrap;
	}

	.chips {
		display: flex;
		align-items: center;
		gap: 0.35em;
		flex-wrap: wrap;
		justify-content: end;
	}

	.combo {
		display: flex;
		align-items: center;
		gap: 0.18em;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.45em;
		height: 1.15em;
		padding: 0 0.35em;
		border: 1px solid #ffffff24;
		border-radius: 3px;
		background: #252525;
		color: #eee;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: calc(var(--font-size-xs) - 1px);
	}

	.plus, .unassigned {
		color: #888;
		font-size: calc(var(--font-size-xs) - 1px);
	}

	.unassigned {
		font-style: italic;
	}

	.chip-button {
		padding: 0.15em;
		background: transparent;
	}

	.chip-button:hover {
		background: #ffffff12;
	}

	.recording {
		border: 1px dashed #6aa6ff99;
		border-radius: 3px;
		padding: 0.2em 0.5em;
		color: #8ebdff;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: calc(var(--font-size-xs) - 1px);
	}

	.conflict {
		grid-column: 1 / -1;
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 0.5em;
		padding: 0.35em 0.5em;
		border: 1px solid #b63b3b80;
		border-radius: 4px;
		background: #3a1b1b;
		color: #eee;
		font-size: calc(var(--font-size-xs) - 1px);
	}

	.empty {
		display: flex;
		height: 100%;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 0.4em;
		color: #888;
		font-size: var(--font-size-xs);
	}

	.footer {
		justify-content: space-between;
		gap: 1em;
		padding: 0.65em 0.75em;
		border-top: 1px solid #ffffff14;
		border-bottom: 0;
		color: #888;
		font-size: calc(var(--font-size-xs) - 1px);
	}
`
