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

.thought {
	display: grid;
	gap: 0.35rem;
}

.thinking-indicator {
	padding: 0.1rem 0;
	font-size: 0.76rem;
}

.message.assistant:has(.tool-group[data-running]) .thinking-indicator {
	display: none;
}

.thought-group,
.tool-group {
	color: var(--assistant-muted);
	font-size: 0.76rem;
}

.thought-group summary,
.tool-group summary {
	display: flex;
	align-items: center;
	gap: 0.38rem;
	width: fit-content;
	padding: 0.1rem 0;
	color: var(--assistant-muted);
	list-style: none;
	cursor: pointer;
	user-select: none;
}

.thought-group summary::-webkit-details-marker,
.tool-group summary::-webkit-details-marker {
	display: none;
}

.thought-group summary svg,
.tool-group summary svg {
	width: 0.8rem;
	height: 0.8rem;
	stroke-width: 1.7;
}

.thought-group[open] summary > svg:last-child,
.tool-group[open] summary > svg:last-child {
	transform: rotate(90deg);
}

.tool-group summary .activity-done {
	color: #7ba98a;
	stroke-width: 2;
}

.tool-group summary .activity-failed {
	color: #f28b82;
	stroke-width: 2;
}

.thinking-shimmer {
	color: transparent;
	background: linear-gradient(100deg, var(--assistant-muted) 28%, #fff 50%, var(--assistant-muted) 72%) 0 / 220% 100%;
	background-clip: text;
	animation: thinking-shimmer 1.8s linear infinite;
}

.thought-content,
.tool-content {
	display: grid;
	gap: 0.35rem;
	margin: 0.35rem 0 0.15rem;
	padding: 0 0 0 0.78rem;
	border-left: 1px solid var(--assistant-border);
}

.thought-content {
	color: var(--assistant-faint);
	font-size: 0.74rem;
	line-height: 1.45;
}

.tool-step {
	display: grid;
	grid-template-columns: 0.75rem minmax(0, 1fr);
	gap: 0.28rem;
	color: var(--assistant-muted);
	line-height: 1.45;
}

.tool-step > span:first-child {
	display: grid;
	place-items: center;
	width: 0.72rem;
	height: 0.72rem;
	margin-top: 0.18rem;
	color: #7ba98a;
	font-size: 0.68rem;
	font-weight: 700;
	line-height: 1;
}


.tool-step[data-status="running"] > span {
	width: 0.28rem;
	height: 0.28rem;
	margin: 0.4rem 0.22rem;
	background: var(--assistant-text-soft);
	border-radius: 50%;
	animation: activity-pulse 1.2s ease-in-out infinite;
}

.tool-step[data-status="failed"] > span:first-child {
	color: #f28b82;
}

.tool-change {
	grid-template-columns: 0.75rem max-content max-content;
	justify-content: start;
	align-items: center;
	margin-top: 0.05rem;
	color: var(--assistant-text-soft);
}

.undo-changes {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	width: max-content;
	margin-left: 0.18rem;
	padding: 0.16rem 0.38rem;
	color: var(--assistant-text-soft);
	background: var(--assistant-surface);
	border-radius: 99px;
	font-size: 0.7rem;
}

.undo-changes svg {
	width: 0.68rem;
	height: 0.68rem;
	stroke-width: 1.8;
}

.undo-changes:hover:not(:disabled) {
	background: var(--assistant-raised);
}

@keyframes thinking-shimmer {
	to { background-position: -220% 0; }
}

@keyframes activity-pulse {
	50% { box-shadow: 0 0 0 0.3rem #7ba98a22; }
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
	border-radius: 14px;
	box-shadow: 0 8px 24px #0004;
	transition: border-color 120ms ease, box-shadow 120ms ease;
}

form:focus-within {
	border-color: var(--assistant-border-hover);
	box-shadow: 0 8px 24px #0004, 0 0 0 1px #ffffff08;
}

textarea {
	grid-column: 1 / -1;
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

.thinking-effort {
	grid-column: 1;
	justify-self: start;
	width: max-content;
	font-size: 0.82rem;
}

.thinking-effort button {
	display: inline-flex;
	width: max-content;
	align-items: center;
	gap: 0.22rem;
	padding: 0.3rem 0.4rem;
	color: var(--assistant-text-soft);
	border-radius: 6px;
}

.thinking-effort button span {
	color: var(--assistant-faint);
	font-size: 1rem;
	line-height: 0.6;
}

.thinking-effort::part(menu) {
	min-width: 7rem;
	padding: 0.2rem;
	background: #202020;
	border: 1px solid var(--assistant-border);
	border-radius: 8px;
	box-shadow: 0 10px 26px #0008;
}

.thinking-check {
	display: inline-block;
	width: 1rem;
	color: #91c7aa;
}

.send {
	display: grid;
	grid-column: 2;
	justify-self: end;
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

