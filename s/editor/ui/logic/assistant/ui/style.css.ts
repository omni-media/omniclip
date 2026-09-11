import {css} from "lit"

export default css`@layer view {

:host {
	--assistant-bg: #0f0f0f;
	--assistant-surface: #171717;
	--assistant-raised: #242424;
	--assistant-border: #2c2c2c;
	--assistant-border-hover: #3a3a3a;
	--assistant-text: #f2f2f2;
	--assistant-text-soft: #d4d4d4;
	--assistant-muted: #999;
	--assistant-faint: #6f6f6f;
	position: fixed;
	top: 52px;
	right: 16px;
	z-index: 20;
	width: min(460px, calc(100vw - 32px));
}

.assistant-panel {
	display: grid;
	grid-template-rows: 48px minmax(0, 1fr) auto;
	width: 100%;
	height: min(680px, calc(100vh - 68px));
	overflow: hidden;
	color: var(--assistant-text);
	background: var(--assistant-bg);
	border: 1px solid var(--assistant-border);
	border-radius: 11px;
	box-shadow: 0 24px 80px #000c;
}

.assistant-panel[data-minimized] {
	height: 48px;
}

[data-minimized] > :not(header) {
	display: none;
}

header,
header strong,
header div {
	display: flex;
	align-items: center;
}

header {
	justify-content: space-between;
	padding-inline: 0.9rem 0.6rem;
	background: var(--assistant-bg);
	border-bottom: 1px solid var(--assistant-border);
}

header strong {
	gap: 0.5rem;
	font-size: 0.82rem;
	font-weight: 600;
	letter-spacing: -0.01em;
}

header strong span {
	color: var(--assistant-text-soft);
}

button {
	color: var(--assistant-muted);
	background: transparent;
	border: 0;
	font: inherit;
	cursor: pointer;
}

header button {
	width: 1.9rem;
	height: 1.9rem;
	padding: 0;
	border-radius: 7px;
	font-size: 1rem;
}

button:hover:not(:disabled) {
	color: var(--assistant-text);
	background: #1f1f1f;
}

.thread {
	min-height: 0;
	overflow: hidden;
}

.messages {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	height: 100%;
	box-sizing: border-box;
	overflow-y: auto;
	padding: 1.5rem 1.25rem;
}

.messages::-webkit-scrollbar {
	width: 8px;
}

.messages::-webkit-scrollbar-thumb {
	background: var(--assistant-border);
	border: 2px solid transparent;
	border-radius: 99px;
	background-clip: padding-box;
}

.welcome {
	display: grid;
	justify-items: center;
	gap: 0.55rem;
	margin: auto;
	text-align: center;
	color: var(--assistant-muted);
	font-size: 0.78rem;
}

.welcome > strong {
	color: var(--assistant-text);
	font-size: 1.4rem;
	font-weight: 500;
	letter-spacing: -0.035em;
}

.message {
	display: grid;
	gap: 0.45rem;
	width: 100%;
	font-size: 0.84rem;
}

.message p {
	margin: 0;
	line-height: 1.55;
	white-space: pre-wrap;
}

.message.user {
	justify-items: end;
}

.message.user p {
	max-width: 85%;
	padding: 0.62rem 0.78rem;
	color: var(--assistant-text);
	background: var(--assistant-raised);
	border: 1px solid var(--assistant-border);
	border-radius: 12px;
}

.message.assistant {
	color: var(--assistant-text-soft);
}

.message-actions {
	display: flex;
	align-items: center;
	gap: 0.1rem;
	min-height: 1.5rem;
	color: var(--assistant-faint);
	opacity: 0;
	transition: opacity 120ms ease;
}

.message:hover .message-actions,
.message:focus-within .message-actions {
	opacity: 1;
}

.message-actions button {
	display: grid;
	place-items: center;
	width: 1.75rem;
	height: 1.75rem;
	padding: 0;
	border-radius: 6px;
}

.message-actions button:disabled {
	display: none;
}

.message-actions svg {
	width: 0.88rem;
	height: 0.88rem;
	stroke-width: 1.7;
}

.message-actions button[data-copied] {
	color: #8fc7a4;
}

.message-timing {
	display: inline-flex;
	align-items: center;
	height: 1.75rem;
	margin-left: 0.25rem;
	font-size: 0.67rem;
	font-variant-numeric: tabular-nums;
	cursor: default;
	outline: none;
}

.timing-tooltip {
	--max-width: none;
}

.timing-tooltip::part(body) {
	min-width: 8.5rem;
	padding: 0.65rem 0.75rem;
	color: var(--assistant-muted);
	background: #1b1b1b;
	border: 1px solid var(--assistant-border-hover);
	border-radius: 9px;
	box-shadow: 0 10px 30px #0008;
	font-size: 0.67rem;
}

.timing-grid {
	display: grid;
	grid-template-columns: auto auto;
	gap: 0.4rem 1.4rem;
	font-variant-numeric: tabular-nums;
}

.timing-grid strong {
	color: var(--assistant-text);
	font-weight: 500;
	text-align: right;
}

.error {
	color: #f28b82;
}

.composer-area {
	min-width: 0;
}

form {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: center;
	gap: 0.45rem;
	margin: 0.75rem;
	padding: 0.55rem;
	background: var(--assistant-surface);
	border: 1px solid var(--assistant-border);
	border-radius: 14px;
	box-shadow: 0 8px 24px #0004;
	transition: border-color 120ms ease, box-shadow 120ms ease;
}

form:focus-within {
	border-color: var(--assistant-border-hover);
	box-shadow: 0 8px 24px #0004, 0 0 0 1px #ffffff08;
}

form > small,
textarea {
	grid-column: 1 / -1;
}

form > small {
	padding: 0.1rem 0.3rem;
	color: var(--assistant-muted);
	font-size: 0.7rem;
}

textarea {
	box-sizing: border-box;
	width: 100%;
	min-width: 0;
	min-height: 3rem;
	max-height: 9rem;
	padding: 0.25rem 0.3rem;
	color: var(--assistant-text);
	background: transparent;
	border: 0;
	font: inherit;
	line-height: 1.45;
	resize: none;
}

textarea::placeholder {
	color: var(--assistant-muted);
}

textarea:focus {
	outline: none;
}

.model-trigger {
	display: flex;
	align-items: center;
	justify-self: start;
	gap: 0.35rem;
	width: max-content;
	min-width: 0;
	max-width: 100%;
	padding: 0.3rem;
	color: var(--assistant-muted);
	border-radius: 7px;
	font-size: 0.7rem;
}

.model-controls {
	display: flex;
	align-items: center;
	justify-self: start;
	gap: 0.1rem;
	min-width: 0;
}

.settings-trigger {
	display: grid;
	place-items: center;
	width: 1.65rem;
	height: 1.65rem;
	padding: 0;
	border-radius: 7px;
}

.settings-trigger svg {
	width: 0.8rem;
	height: 0.8rem;
	stroke-width: 1.8;
}

.model-trigger svg,
.model-option svg {
	width: 0.8rem;
	height: 0.8rem;
	stroke-width: 1.8;
}

.model-name {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.model-source {
	color: var(--assistant-faint);
}

.model-caret {
	margin-left: 0.15rem;
}

.model-picker::part(menu) {
	min-width: 15rem;
	padding: 0.35rem;
	color: var(--assistant-text-soft);
	background: #1b1b1b;
	border: 1px solid var(--assistant-border-hover);
	border-radius: 10px;
	box-shadow: 0 14px 40px #0009;
}

.model-option {
	min-height: 2.3rem;
	padding: 0.5rem 0.6rem;
	color: var(--assistant-text-soft);
	border-radius: 7px;
	font-size: 0.78rem;
}

.model-option:hover,
.model-option[data-selected] {
	background: var(--assistant-raised);
}

.model-check {
	opacity: 0;
}

.model-option[data-selected] .model-check {
	opacity: 1;
}

.model-settings {
	--max-width: 21rem;
}

.model-settings::part(body) {
	width: 20rem;
	box-sizing: border-box;
	padding: 0;
	color: var(--assistant-text-soft);
	background: #1b1b1b;
	border: 1px solid var(--assistant-border-hover);
	border-radius: 11px;
	box-shadow: 0 16px 48px #000a;
}

.settings-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.8rem 0.85rem 0.7rem;
}

.settings-heading > div {
	display: grid;
	gap: 0.12rem;
}

.settings-heading strong {
	color: var(--assistant-text);
	font-size: 0.78rem;
	font-weight: 550;
}

.settings-heading span,
.settings-title {
	color: var(--assistant-muted);
	font-size: 0.66rem;
}

.settings-heading button {
	display: grid;
	place-items: center;
	width: 1.75rem;
	height: 1.75rem;
	padding: 0;
	border-radius: 7px;
}

.settings-heading svg {
	width: 0.8rem;
	height: 0.8rem;
}

.settings-section {
	display: grid;
	gap: 0.7rem;
	padding: 0.15rem 0.85rem 0.85rem;
}

.settings-title {
	font-weight: 550;
	letter-spacing: 0.02em;
	text-transform: uppercase;
}

.settings-columns {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.65rem;
	min-width: 0;
}

.model-settings wa-divider {
	--color: var(--assistant-border);
	margin-bottom: 0.75rem;
}

.model-settings wa-select,
.model-settings wa-number-input,
.model-settings wa-slider {
	--wa-color-brand-fill-loud: #8a8a8a;
	--wa-color-brand-on-loud: #111;
	width: 100%;
	min-width: 0;
	font-size: 0.7rem;
}

.model-settings wa-select::part(form-control-label),
.model-settings wa-number-input::part(label),
.model-settings wa-slider::part(label) {
	margin-bottom: 0.28rem;
	color: var(--assistant-muted);
	font-size: 0.66rem;
}

.model-settings wa-select::part(combobox),
.model-settings wa-number-input::part(base) {
	min-height: 2rem;
	color: var(--assistant-text-soft);
	background: var(--assistant-surface);
	border-color: var(--assistant-border-hover);
	border-radius: 7px;
}

.model-settings wa-select::part(listbox) {
	color: var(--assistant-text-soft);
	background: #1b1b1b;
	border-color: var(--assistant-border-hover);
}

.setting-slider {
	display: grid;
	gap: 0.35rem;
	min-width: 0;
}

.setting-slider > span {
	display: flex;
	justify-content: space-between;
	color: var(--assistant-muted);
	font-size: 0.66rem;
}

.setting-slider output {
	color: var(--assistant-text-soft);
	font-variant-numeric: tabular-nums;
}

.setting-slider wa-slider {
	--track-size: 0.25rem;
	--thumb-width: 0.8rem;
	--thumb-height: 0.8rem;
}

.setting-slider wa-slider::part(track) {
	background: var(--assistant-border-hover);
}

.setting-slider wa-slider::part(indicator),
.setting-slider wa-slider::part(thumb) {
	background: #999;
}

.send {
	display: grid;
	place-items: center;
	width: 2rem;
	height: 2rem;
	padding: 0;
	color: #101010;
	background: #7a7a7a;
	border-radius: 8px;
	font-size: 1rem;
	font-weight: 600;
}

.send:hover:not(:disabled) {
	color: #0b0b0b;
	background: #969696;
}

.send:disabled {
	color: var(--assistant-faint);
	background: #292929;
	cursor: default;
}

@media (max-width: 600px) {
	:host {
		inset: 42px 0 auto;
		width: auto;
	}

	.assistant-panel {
		height: calc(100vh - 42px);
		border-radius: 0;
	}
}

}`

