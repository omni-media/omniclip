import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.timeline-path {
	display: flex;
	align-items: center;
	min-height: 32px;
	padding: 0 0.7em;
	border-top: 1px solid #1c1c1c;
	border-bottom: 1px solid #282828;
	background: #181818;
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
	background: #111;
	border-top: 1px solid #1c1c1c;
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
}

}`

