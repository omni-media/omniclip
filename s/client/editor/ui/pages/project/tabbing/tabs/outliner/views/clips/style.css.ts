
import {css} from "lit"

export default css`@layer view {

:host {
	display: block;
}

.search-bar {
	padding: 0.75em;
	border-bottom: 1px solid #101010;
	background: #0f0f0f;

	& input {
		width: 100%;
		min-width: 0;
		height: 32px;
		padding: 0 0.65em;
		background: #161616;
		border: 1px solid transparent;
		border-radius: 7px;
		color: #d3d3d3;
		font-family: inherit;
		font-size: var(--font-size-xs);
		transition: background 0.12s ease, border-color 0.12s ease;
	}

	& input::placeholder {
		color: #777;
	}

	& input:focus {
		outline: none;
		border-color: #3a3a3a;
	}
}

.outliner-content {
	flex: 1;
	min-height: 0;
	padding: 0.75em;
	overflow: auto;
}

.placeholder {
	color: #8f8f8f;
	font-size: var(--font-size-xs);
	text-align: center;
	padding: 2em;
}

wa-tree {
	--indent-size: 1em;
	--indent-guide-width: 0;
}

wa-tree-item {
	&::part(item) {
		min-height: 30px;
		border-radius: 5px;
	}

	&::part(expand-button) {
		font-size: 0.75em;
		width: 1.67em;
	}

	&[data-root]::part(expand-button) {
		display: none;
	}

	&::part(label) {
		flex: 1;
		min-width: 0;
	}
}

.item-row {
	display: grid;
	grid-template-columns: 0.7em 1.2em minmax(0, 1fr) auto 4em;
	align-items: center;
	gap: 0.4em;
	min-width: 0;
	width: 100%;
}

.color-swatch {
	width: 0.45em;
	height: 1.2em;
	border-radius: 2px;
	background: #4c535e;
}

.icon {
	display: flex;
	align-items: center;
	color: #9a9a9a;
}

.icon svg, .scope-icon svg {
	width: 1em;
	height: 1em;
}

.scope-icon {
	display: flex;
	align-items: center;
	gap: 0.25em;
	font-size: 0.8em;
	color: #777;
}

.label {
	color: #d0d0d0;
	font-size: var(--font-size-xs);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.duration {
	color: #8f8f8f;
	font-size: var(--font-size-xs);
	justify-self: end;
}

}`

