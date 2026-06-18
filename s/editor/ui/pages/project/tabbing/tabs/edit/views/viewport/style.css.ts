import {css} from "lit"

export default css`@layer view {
:host {
	height: 100%;
}

.viewport {
	display: flex;
	height: 100%;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	background: #0b0b0b;
	overflow: hidden;
}

.viewer-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	min-height: 36px;
	padding: 0 0.9em;
	color: #aaa;
	background: #1d1d1d;
	border-bottom: 1px solid #101010;
	font-size: var(--font-size-xs);
}

.viewer-header-left,
.viewer-actions {
	display: flex;
	align-items: center;
}

.viewer-actions {
	gap: 0.7em;
}

.viewer-title {
	color: #d3d3d3;
	font-size: var(--font-size-xs);
	font-weight: 600;
}

.viewer-meta {
	color: #8f8f8f;
	font-variant-numeric: tabular-nums;
}

.viewer-zoom-dropdown::part(menu) {
	padding: 0.75em;
	color: #d3d3d3;
	background: #1d1d1d;
	border: 1px solid #101010;
}

.viewer-zoom-menu {
	display: flex;
	flex-direction: column;
	gap: 0.75em;
}

.viewer-zoom-menu-title {
	font-size: var(--font-size-xs);
	color: #8f8f8f;
	font-variant-numeric: tabular-nums;
	text-transform: uppercase;
	letter-spacing: 0.04em;
}

.viewer-zoom-slider {
	--track-size: 0.32em;
	--thumb-width: 0.85em;
	--thumb-height: 0.85em;
}

.viewer-zoom-slider::part(slider) {
	padding-block: 0.15em;
}

.viewer-zoom-slider::part(track) {
	background: #0f0f0f;
}

.viewer-zoom-slider::part(indicator) {
	background: #4e5a69;
}

.viewer-zoom-slider::part(thumb) {
	background: #d3d3d3;
}

.viewer-zoom-presets {
	display: flex;
	flex-direction: column;
	gap: 0.2em;
}

.viewer-zoom-presets wa-dropdown-item {
	padding: 0.35em 0.6em;
	color: #d3d3d3;
	font-size: var(--font-size-xs);
}

.viewer-zoom-presets wa-dropdown-item:hover {
	background: #2b2b2b;
}

.viewer-zoom-presets wa-dropdown-item::part(label) {
	font-weight: 500;
}

.viewer-zoom-presets wa-dropdown-item::part(details) {
	color: #8f8f8f;
	font-variant-numeric: tabular-nums;
}

.viewer-zoom-trigger::part(base) {
	height: 2em;
	color: #9a9a9a;
	background: transparent;
	border: none;
	border-radius: 0.18em;
	font-variant-numeric: tabular-nums;
}

.viewer-zoom-trigger:hover::part(base) {
	color: #e0e0e0;
	background: #303030;
}

.viewer-zoom-trigger::part(label) {
	font-size: var(--font-size-xs);
	font-weight: 500;
}

.viewer-zoom-trigger::part(caret) {
	margin-inline-start: 0.1em;
}

.viewer-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2em;
	height: 2em;
	color: #9a9a9a;
	background: transparent;
	border: none;
	border-radius: 0.18em;
	cursor: pointer;
}

.viewer-button:hover {
	color: #e0e0e0;
	background: #303030;
}

.viewer-button:disabled {
	opacity: 0.32;
	cursor: default;
	background: transparent;
}

.viewer-button svg {
	width: 1em;
	height: 1em;
}

.viewer-stage {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	overflow: hidden;
}

.viewer-canvas {
	display: flex;
	height: 100%;
	align-items: center;
	justify-content: center;
	transform: scale(var(--viewer-zoom));
	transform-origin: center;
}

canvas {
	width: 100%;
	height: 100%;
	background: #000;
}
}`
