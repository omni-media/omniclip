import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: hidden;
}

.project-page {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.project-page > header {
	display: flex;
	align-items: center;
	min-height: 36px;
	background: #0f0f0f;
	border-bottom: 0;
}

.right {
	display: flex;
	flex: 1;
	justify-content: end;
	align-items: center;
	gap: 0.2em;

	.spacer {
		width: 1px;
		height: 18px;
		margin: 0 0.45em;
		background: #333;
	}

	.assistant, .settings, .shortcuts, .export {

		&::part(base) {
			height: 2em;
			padding: 0 0.65em;
			color: #aaa;
			background: transparent;
			border: none;
			border-radius: 0.18em;
			font-size: var(--font-size-xs);
		}

		&:hover::part(base) {
			color: #e8e8e8;
		}

		&::part(label),
		&::part(start) {
			line-height: 1;
		}

		wa-icon {
			margin-right: 0.35em;
			font-size: 0.95em;
		}

	}

	.export::part(base) {
		color: #1d2940;
		background: linear-gradient(135deg, #fff, #dbe5f7);
		font-weight: 600;
		box-shadow: inset 0 1px 0 #fff, 0 2px 10px #b8c8e54d;
		transition: background 160ms ease, box-shadow 160ms ease;
	}

	.assistant::part(base) {
		font-weight: 600;
	}

	.assistant-label,
	.assistant-mark {
		color: #89b6ff;
		background: linear-gradient(110deg, #65c5ff, #9182ff);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		transition: filter 160ms ease;
	}

	.assistant:hover .assistant-label,
	.assistant:hover .assistant-mark {
		filter: brightness(1.25);
	}

	.export:hover::part(base) {
		color: #1d2940;
		background: linear-gradient(135deg, #fff, #edf3ff);
		box-shadow: inset 0 1px 0 #fff, 0 3px 14px #ceddff80;
	}

	.export:active::part(base) {
		box-shadow: inset 0 1px 3px #0004;
	}

	.assistant:focus-visible::part(base),
	.export:focus-visible::part(base) {
		outline: 2px solid #b8d8ff;
		outline-offset: 2px;
	}

	.assistant-mark {
		margin-right: 0.35em;
		font-size: 1.1em;
		line-height: 1;
	}
}


/*
 * DEFAULT: COMPACT MODE (Mobile-First)
 */

.layout-grid {
	display: grid;
	flex: 1;
	min-height: 0;
}

wa-split-panel {
	display: contents;
}

wa-split-panel::part(divider) {
	display: none;
}

.panel {
	display: none;
	height: 100%;
	width: 100%;
	overflow: auto;
	background: #0f0f0f;
}

.panel[data-active] {
	display: flex;
	flex-direction: column;
}

.panel[data-active="edit"] {
	display: grid;
	grid-template-rows: 1fr 1fr;
}

.viewport-panel {
	display: none;
}
.browser-panel {
	display: none;
}

.panel[data-active="edit"] .viewport-panel {
	display: flex;
}

.timeline-panel {
	grid-row: 2;
}

.tab-bar {
	height: 100%;
}


/*
 * BIG MODE: Activated on larger screens
 */
@media (min-width: 1024px) {
	.project-page > header .tab-bar {
		display: none;
	}

	.layout-grid {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		height: 100%;
		width: 100%;
	}

	wa-split-panel {
		overflow: auto;
		--divider-width: 1px;
		--divider-hit-area: 4px;
		--min: 200px;
		--max: calc(100% - 200px);
		height: 100%;
		width: 100%;
		display: grid;
	}

	wa-split-panel::part(divider) {
		display: flex;
		background: #101010;
	}

	.panel {
		display: flex;
		flex-direction: column;
		overflow: auto;
		position: relative;
	}

	.timeline-panel {
		grid-row: auto;
	}

	.export-panel {
		display: none;
	}
}

}`
