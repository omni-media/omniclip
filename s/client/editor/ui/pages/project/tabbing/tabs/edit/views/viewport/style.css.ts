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
	background: #111;
	overflow: hidden;
}

.viewer-header {
	text-shadow: none;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	min-height: 36px;
	padding: 0 0.9em;
	color: #aaa;
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
	min-width: 140px;
	padding: 6px;
	color: #d3d3d3;
	background: #151515;
	border: none;
	border-radius: 7px;
	box-shadow: 0 0.6em 1.8em #000a;
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	text-shadow: none;
}

.viewer-zoom-menu {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.viewer-zoom-menu-title {
	padding: 4px 8px 0;
	font-size: calc(var(--font-size-xs) - 1px);
	font-weight: 500;
	color: #8f8f8f;
	font-variant-numeric: tabular-nums;
	text-transform: uppercase;
	letter-spacing: 0.02em;
}

.viewer-zoom-slider {
	margin: 0 8px;
	--track-size: 3px;
	--thumb-width: 10px;
	--thumb-height: 10px;
}

.viewer-zoom-slider::part(slider) {
	padding-block: 0.15em;
}

.viewer-zoom-slider::part(track) {
	border-radius: 99px;
	background: #292929;
}

.viewer-zoom-slider::part(indicator) {
	border-radius: 99px;
	background: #777;
}

.viewer-zoom-slider::part(thumb) {
	background: #c4c8cd;
	border: none;
	border-radius: 50%;
	box-shadow: none;
	transition: background 140ms ease;
}

.viewer-zoom-slider:hover::part(thumb) {
	background: #e0e3e7;
}

.viewer-zoom-presets {
	display: flex;
	flex-direction: column;
	gap: 0.2em;
}

.viewer-zoom-presets wa-dropdown-item {
	padding: 7px 8px;
	border-radius: 5px;
	color: #d3d3d3;
	font-size: var(--font-size-xs);
	line-height: 1.2;
	transition: background 140ms ease;
}

.viewer-zoom-presets wa-dropdown-item:hover {
	background: #2d2d2d;
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
