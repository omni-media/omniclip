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

.right {
	display: flex;
	flex: 1;
	justify-content: end;
	align-items: center;

	.spacer {
		width: 1px;
		height: 20px;
		margin: 0 1em;
		background: gray;
	}

	.settings, .shortcuts, .export {

		&::part(base) {
			height: 20px;
			padding: 0 0.5em;
			font-size: var(--font-size-xs);
		}

		wa-icon {
			margin-right: 0.5em;
		}

		&::part(caret) {
			margin-left: 0.5em;
		}
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
.panel[data-active="edit"] .viewport-panel {
	display: flex;
}

.timeline-panel {
	grid-row: 2;
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
		--divider-width: 1px;
		--min: 200px;
		--max: calc(100% - 200px);
		height: 100%;
		width: 100%;
		display: grid;
	}

	wa-split-panel::part(divider) {
		display: flex;
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

