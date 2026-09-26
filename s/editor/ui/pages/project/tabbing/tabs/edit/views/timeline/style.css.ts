import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #0f0f0f;
}

.timeline-path {
	display: flex;
	align-items: center;
	min-height: 32px;
	padding: 0 0.7em;
	background: #0f0f0f;
}

wa-breadcrumb {
	--separator-spacing: 0.45em;
	font-size: var(--font-size-xs);
}

wa-breadcrumb-item::part(label) {
	color: #aaa;
}

wa-breadcrumb-item:hover::part(label),
wa-breadcrumb-item[data-current]::part(label) {
	color: #e5e5e5;
}

wa-breadcrumb-item[data-current]::part(label) {
	font-weight: 600;
}

.timeline {
	position: relative;
	flex: 1;
	overflow: auto;
	scrollbar-width: none;
	background: #0f0f0f;
}

.spacer {
	height: 1px;
}

.timeline::-webkit-scrollbar {
	display: none;
}

canvas {
	display: block;
	position: sticky;
	left: 0;
	top: 0;
	background: #0f0f0f;
}

}`
