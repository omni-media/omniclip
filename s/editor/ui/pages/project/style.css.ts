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
	background: #1d1d1d;
	border-bottom: 1px solid #101010;
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

	.settings, .shortcuts, .export {

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
			background: #333;
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
		color: #d3d3d3;
		background: #2b2b2b;
	}

	.export:hover::part(base) {
		background: #3a3a3a;
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
	background: #181818;
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

.mixer-panel {
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

