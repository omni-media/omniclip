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
		grid-template-columns: 300px 1fr 300px;
		grid-template-rows: 1fr 1fr;
		grid-template-areas:
			"mediabin viewport inspector"
			"outliner timeline inspector";
		overflow: hidden;
	}

	.panel {
		display: flex;
		flex-direction: column;
		overflow: auto;
		position: relative;
	}

	.outliner-panel {
		grid-area: outliner;
		border-right: 1px solid #1a1a1a;
	}

	.browser-panel {
		grid-area: mediabin;
		border-right: 1px solid #1a1a1a;
	}

	.viewport-panel {
		grid-area: viewport;
		display: flex;
	}

	.inspector-panel {
		grid-area: inspector;
		border-left: 1px solid #1a1a1a;
	}

	.timeline-panel {
		grid-area: timeline;
		border-top: 1px solid #1a1a1a;
	}

	.export-panel {
		display: none;
	}
}

}`

