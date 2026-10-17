
import {css} from "lit"

export default css`
.caption-title {
	margin: 0;
	color: #dce3f1;
	font-size: var(--font-size-m);
	font-weight: 500;
}

.preview-list {
	display: flex;
	flex-direction: column;
	gap: 0.45em;
	max-height: 200px;
	overflow: auto;
}

.preview-row {
	display: flex;
	flex-direction: column;
	gap: 0.6em;
	align-items: start;
	padding: 0.55em 0.7em;
	background: #191e28;
	border-radius: 6px;
}

.preview-time {
	font-family: var(--font-mono, monospace);
	font-size: var(--font-size-xs);
	color: #7f8999;
}

.preview-text {
	color: #c5ccda;
	font-size: var(--font-size-s);
}

.caption-style-controls {
	display: flex;
	flex-direction: column;
	gap: 0.5em;
}
`

