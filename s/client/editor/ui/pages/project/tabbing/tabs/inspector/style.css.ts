import {css} from "lit"

export default css`@layer view {

:host {
	--inspector-bg: #0f0f0f;
	--inspector-surface: #171717;
	--inspector-control: #202020;
	--inspector-hover: #2a2a2a;
	--inspector-active: #303030;
	--inspector-text: #e7e7e7;
	--inspector-muted: #9d9d9d;
	--inspector-divider: rgb(255 255 255 / 6%);
	display: flex;
	flex-direction: column;
	height: 100%;
	background: var(--inspector-bg);
	color: var(--inspector-text);
}

.placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding: 1em;
	color: var(--inspector-muted);
	font-size: var(--font-size-xs);
	text-align: center;
}

.inspector {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.panel-content {
	flex: 1;
	overflow-y: auto;
}

}`
