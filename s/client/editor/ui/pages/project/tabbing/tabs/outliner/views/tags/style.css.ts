
import {css} from "lit"

export default css`@layer view {

:host {
	display: block;
	color: #cfcfcf;
	font-size: var(--font-size-xs);
}

.panel {
	display: flex;
	flex-direction: column;
	gap: 0.7em;
	padding: 0.75em;
}

.toolbar {
	display: grid;
	grid-template-columns: minmax(0, 1fr) 32px;
	gap: 0.4em;
	align-items: center;
}

wa-input {
	min-width: 0;
	--wa-form-control-background-color: #161616;
	--wa-form-control-border-color: transparent;
	--wa-form-control-border-color-hover: transparent;
	--wa-form-control-border-color-focus: #3a3a3a;
	--wa-form-control-border-radius: 7px;
	--wa-form-control-value-color: #d3d3d3;
	--wa-form-control-placeholder-color: #777;

	&::part(input-wrapper) {
		height: 32px;
		min-height: 32px;
		box-shadow: none;
	}

	&::part(input) {
		padding-inline: 0.65em;
		font-family: inherit;
		font-size: var(--font-size-xs);
	}
}

wa-button {
	&::part(button) {
		min-height: 28px;
		padding: 0;
		border: 0;
		border-radius: 5px;
		background: transparent;
		color: #858585;
		font-size: var(--font-size-xs);
		box-shadow: none;
	}

	&:hover::part(button) {
		background: #222;
		color: #e8e8e8;
	}
}

#create-tag {
	&::part(button) {
		width: 32px;
		height: 32px;
		background: #161616;
		color: #aaa;
	}

	& svg {
		width: 16px;
		height: 16px;
	}

	&:hover::part(button) {
		background: #222;
		color: #e8e8e8;
	}
}

.tag-list {
	display: grid;
	gap: 3px;
}

.tag-row {
	display: grid;
	grid-template-columns: 20px minmax(0, 1fr) 26px;
	align-items: center;
	gap: 0.3em;
	min-height: 32px;
	padding-inline: 0.35em;
	border-radius: 5px;

	&:hover, &:focus-within {
		background: #161616;

		.delete {
			opacity: 1;
		}
	}

	> wa-popover {
		display: contents;
	}
}

.tag-name {
	--wa-form-control-background-color: transparent;
	--wa-form-control-border-radius: 5px;

	&::part(input-wrapper) {
		height: 28px;
		min-height: 28px;
	}

	&::part(input) {
		padding-inline: 0.25em;
		text-overflow: ellipsis;
	}
}

.swatch {
	justify-self: center;

	&::part(button) {
		width: 20px;
		min-height: 24px;
		display: grid;
		place-items: center;
	}
}

.color-dot {
	display: block;
	width: 12px;
	height: 12px;
	border-radius: 3px;

	&[data-colorless] {
		border: 1px dashed #777;
	}
}

.color-actions {
	display: flex;
	align-items: center;
	gap: 4px;

	wa-color-picker::part(trigger) {
		width: 32px;
		height: 32px;
		min-height: 32px;
		border: 1px solid #404040;
		border-radius: 6px;
		padding: 3px;
	}
}

.no-color {
	&[disabled] {
		visibility: hidden;
	}

	&::part(button) {
		width: 24px;
		min-height: 24px;
		font-size: 18px;
	}

	&:hover::part(button) {
		background: transparent;
		color: #ddd;
	}
}

.delete {
	opacity: 0;
	justify-self: center;

	&::part(button) {
		width: 24px;
		height: 24px;
		min-height: 24px;
		display: grid;
		place-items: center;
	}

	& svg {
		width: 14px;
		height: 14px;
	}

	&:hover::part(button) {
		background: transparent;
		color: #e7a0a5;
	}
}

.empty, .error {
	margin: 0;
	line-height: 1.5;
}

.empty {
	padding: 1em 0.5em;
	color: #858585;
	text-align: center;
}

.error {
	color: #ff8f8f;
}

wa-popover {
	--max-width: min(280px, 90vw);

	&::part(body) {
		padding: 14px;
		border: 0;
		border-radius: 10px;
		background: #161616;
		color: #ccc;
		box-shadow: 0 8px 24px #0005;
	}
}

.create {
	display: grid;
	gap: 10px;
	width: min(240px, 75vw);
	font-size: var(--font-size-xs);

	wa-input {
		--wa-form-control-background-color: #222;

		&::part(input-wrapper) {
			border-radius: 6px;
		}
	}
}

.create-row {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: center;
	gap: 8px;
}

.save {
	width: 100%;

	&::part(button) {
		width: 100%;
		min-height: 32px;
		padding-inline: 0.8em;
		background: #2a2a2a;
		color: #ddd;
	}

	&:hover::part(button) {
		background: #333;
	}
}

}`

