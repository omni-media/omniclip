
import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #151515;
	color: #cfcfcf;
}

.search-bar {
	padding: 0.75em;
	border-bottom: 1px solid #101010;
	background: #151515;
}

.search-bar input {
	width: 100%;
	height: 32px;
	padding: 0 0.65em;
	background: #1f1f1f;
	border: 1px solid #2b2b2b;
	border-radius: 3px;
	color: #d3d3d3;
	font-size: var(--font-size-xs);
}

.search-bar input:focus {
	outline: none;
	border-color: #575757;
}

.outliner-tabs {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.outliner-tabs > input[type="radio"] {
	display: none;
}

.tab-bar {
	display: flex;
	height: 36px;
	gap: 0.2em;
	padding: 0.2em;
	border-bottom: 1px solid #101010;
	background: #1d1d1d;
}

.tab-bar label {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	padding: 0 0.7em;
	color: #aaa;
	background: transparent;
	border-radius: 0.25em;
	font-size: var(--font-size-xs);
	cursor: pointer;
	transition: background 0.12s ease, color 0.12s ease;
}

.tab-bar label:hover {
	color: #e8e8e8;
	background: #333;
}

.outliner-tabs > input#tab-clips:checked ~ .tab-bar label[for="tab-clips"],
.outliner-tabs > input#tab-roles:checked ~ .tab-bar label[for="tab-roles"],
.outliner-tabs > input#tab-tags:checked ~ .tab-bar label[for="tab-tags"] {
	color: #e8e8e8;
	background: #3f3f3f;
}

.tab-panels {
	flex: 1;
	padding: 0.75em;
	overflow: auto;
}

.tab-panel {
	display: none;
}

.outliner-tabs > input#tab-clips:checked ~ .tab-panels #clips-panel,
.outliner-tabs > input#tab-roles:checked ~ .tab-panels #roles-panel,
.outliner-tabs > input#tab-tags:checked ~ .tab-panels #tags-panel {
	display: flex;
	flex-direction: column;
	gap: 0.85em;
}

.placeholder {
	color: #8f8f8f;
	font-size: var(--font-size-xs);
	text-align: center;
	padding: 2em;
}

.section {
	display: flex;
	flex-direction: column;
	gap: 0.45em;
}

.section-title {
	color: #8f8f8f;
	font-size: calc(var(--font-size-xs) - 1px);
	font-weight: 600;
	text-transform: uppercase;
}

.item-list {
	display: flex;
	flex-direction: column;
}

.item-list-header {
	display: grid;
	grid-template-columns: 0.7em 1.5em minmax(0, 1fr) 4.8em 1.8em;
	gap: 0.5em;
	padding: 0.2em 0.5em;
	color: #777;
	font-size: calc(var(--font-size-xs) - 1px);
	text-transform: uppercase;
}

.item-list-header span:nth-child(1) { grid-column: 3; }
.item-list-header span:nth-child(2) { grid-column: 4; }

.item-row {
	display: grid;
	grid-template-columns: 0.7em 1.5em minmax(0, 1fr) 4.8em 1.8em;
	align-items: center;
	gap: 0.5em;
	min-height: 30px;
	padding: 0 0.5em;
	border-bottom: 1px solid #242424;
	background: transparent;
	cursor: pointer;
	transition: background 0.12s ease, color 0.12s ease;
}

.item-row:hover {
	background: #242424;
}

.item-row[data-selected] {
	background: #303030;
	box-shadow: inset 2px 0 0 #8b8b8b;
}

.color-swatch {
	width: 0.45em;
	height: 1.2em;
	border-radius: 1px;
	background: #6d7788;
}

.icon {
	display: flex;
	align-items: center;
	color: #9a9a9a;
}

.icon svg {
	width: 1em;
	height: 1em;
}

.label {
	color: #d0d0d0;
	font-size: var(--font-size-xs);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.duration {
	color: #8f8f8f;
	font-size: var(--font-size-xs);
	justify-self: end;
}

.star-button {
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	color: #777;
	padding: 0;
	border-radius: 3px;
	cursor: pointer;
	transition: color 0.12s ease, background 0.12s ease;
}

.star-button:hover {
	background: #333;
	color: #d5d5d5;
}

.star-button svg {
	width: 1em;
	height: 1em;
}

.star-button[data-starred] {
	color: #d4b663;
}

.role-list {
	display: flex;
	flex-direction: column;
	gap: 0.25em;
}

.role-section {
	display: flex;
	flex-direction: column;
	gap: 0.4em;
}

.role-section-title {
	color: #8f8f8f;
	font-size: calc(var(--font-size-xs) - 1px);
	font-weight: 600;
	text-transform: uppercase;
}

.role-row {
	display: grid;
	grid-template-columns: 1.7em minmax(0, 1fr) 2.5em;
	align-items: center;
	gap: 0.55em;
	min-height: 30px;
	padding: 0 0.55em;
	border: 1px solid color-mix(in srgb, var(--role-color), #111 48%);
	border-radius: 3px;
	background: color-mix(in srgb, var(--role-color), #111 28%);
	color: #e5e5e5;
	cursor: pointer;
	transition: filter 0.12s ease, box-shadow 0.12s ease;
}

.role-row:hover {
	filter: brightness(1.08);
}

.role-row[data-selected] {
	box-shadow: inset 0 0 0 1px #dadada;
}

.role-row[data-disabled] {
	filter: grayscale(0.75) brightness(0.72);
}

.role-row[data-subrole] {
	margin-left: 1.2em;
}

.role-toggle {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.15em;
	height: 1.15em;
	padding: 0;
	background: rgba(0, 0, 0, 0.18);
	border: 1px solid rgba(255, 255, 255, 0.45);
	border-radius: 2px;
	cursor: pointer;
}

.role-toggle span {
	width: 0.55em;
	height: 0.55em;
	background: #f0f0f0;
	opacity: 0;
}

.role-toggle[data-enabled] span {
	opacity: 1;
}

.role-name,
.role-count {
	font-size: var(--font-size-xs);
}

.role-name {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-shadow: 0 1px 1px rgba(0, 0, 0, 0.32);
}

.role-count {
	justify-self: end;
	opacity: 0.82;
}

.role-actions {
	margin-top: 0.3em;
}

.role-actions wa-button::part(base) {
	width: 100%;
	min-height: 2.2em;
	border-radius: 3px;
	font-size: var(--font-size-xs);
}

}`

