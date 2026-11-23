
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
	display: block;
	position: fixed;
	top: 52px;
	right: 16px;
	z-index: 20;
	width: min(460px, calc(100vw - 32px));
	height: min(680px, calc(100vh - 68px));
	min-width: min(320px, calc(100vw - 32px));
	min-height: min(260px, calc(100vh - 68px));
	max-width: calc(100vw - 32px);
	max-height: calc(100vh - 68px);
	resize: both;
	overflow: hidden;
}

:host([data-minimized]) {
	height: 48px;
	min-height: 48px;
	resize: horizontal;
}

:host > div {
	width: 100%;
	height: 100%;
}

:host:has(> div[hidden]) {
	display: none;
}

.assistant-panel {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	grid-template-rows: minmax(0, 1fr);
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	overflow: hidden;
	color: var(--assistant-text);
	background: var(--assistant-bg);
	border-radius: 11px;
	box-shadow: 0 24px 80px #000c;
}

.chat-view {
	display: grid;
	grid-template-rows: 48px minmax(0, 1fr) auto;
	min-width: 0;
	min-height: 0;
	overflow: hidden;
}

.assistant-panel[data-fullscreen][data-signed-in] {
	grid-template-columns: 240px minmax(0, 1fr);
}

.cloud-sign-in {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16px;
	padding: 24px;
	text-align: center;

	p {
		color: var(--assistant-muted);
		font-size: 0.85rem;
	}

	.mcp-link {
		padding: 0;
		color: var(--assistant-text);
		font: inherit;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.mcp-link:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 3px;
	}

	a {
		padding: 10px 20px;
		border-radius: 7px;
		color: var(--assistant-text);
		background: var(--assistant-raised);
		text-decoration: none;
	}

	a:hover {
		background: var(--assistant-border-hover);
	}
}

.assistant-panel[data-fullscreen] {
	header {
		cursor: default;
		touch-action: auto;
	}

	header > div {
		margin-left: auto;
	}

	.messages {
		align-items: center;
	}

	.message {
		width: min(100%, 700px);
	}

	.chat-view > .composer-shell {
		width: min(100%, 700px);
		justify-self: center;
	}
}

.assistant-panel[data-minimized] {
	height: 48px;

	.chat-view {
		grid-template-rows: 48px;
	}

	.chat-view > :not(header),
	.thread-sidebar {
		display: none;
	}
}

.thread-sidebar {
	display: flex;
	flex-direction: column;
	min-height: 0;
	background: #141414;
	border-right: 1px solid var(--assistant-border);
}

.thread-sidebar-brand {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex-shrink: 0;
	height: 48px;
	box-sizing: border-box;
	padding-inline: 0.85rem;
	border-bottom: 1px solid var(--assistant-border);
	color: var(--assistant-text);
	font-size: 0.82rem;
	font-weight: 600;

	img {
		width: 24px;
		height: 24px;
		object-fit: contain;
	}
}

.thread-sidebar-list {
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 0;
	padding: 0.65rem;

	[data-slot="aui_thread-list-root"] {
		flex: 1;
		min-height: 0;
	}

	[data-slot="aui_thread-list-items"] {
		flex: 1;
		min-height: 0;
		overflow-y: auto;

		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-button {
			display: none;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 99px;
			background: var(--assistant-border);
		}
	}

	button {
		font-size: 0.875rem;
	}

	[data-slot="aui_thread-list-search-icon"] {
		top: 50%;
		transform: translateY(-50%);
	}
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
	cursor: grab;
	touch-action: none;
	user-select: none;
}

header:active {
	cursor: grabbing;
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
	display: grid;
	place-items: center;
	flex: 0 0 1.9rem;
	width: 1.9rem;
	height: 1.9rem;
	padding: 0;
	border-radius: 7px;
	font-size: 1rem;
	line-height: 1;
}

button:hover:not(:disabled) {
	color: var(--assistant-text);
	background: #1f1f1f;
}

.thread {
	position: relative;
	min-height: 0;
	overflow: hidden;
}

.scroll-to-latest {
	position: absolute;
	bottom: 0.75rem;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.4rem 0.7rem;
	color: var(--assistant-text-soft);
	background: var(--assistant-raised);
	border: 1px solid var(--assistant-border-hover);
	border-radius: 99px;
	font-size: 0.75rem;

	&:disabled {
		display: none;
	}

	svg {
		width: 0.85rem;
		height: 0.85rem;
	}
}

.messages {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	height: 100%;
	box-sizing: border-box;
	overflow-y: auto;
	padding: 1.5rem 1.25rem;

	&::-webkit-scrollbar {
		width: 8px;
	}

	&::-webkit-scrollbar-thumb {
		border: 2px solid transparent;
		border-radius: 99px;
		background: var(--assistant-border);
		background-clip: padding-box;
	}
}

.welcome {
	display: grid;
	justify-items: center;
	gap: 0.55rem;
	margin: auto;
	text-align: center;
	color: var(--assistant-muted);
	font-size: 0.78rem;

	> strong {
		color: var(--assistant-text);
		font-size: 1.4rem;
		font-weight: 500;
		letter-spacing: -0.035em;
	}
}

.welcome-fullscreen {
	width: min(100%, 700px);
	box-sizing: border-box;
	gap: 1rem;
	padding-inline: 1rem;

	.composer-area {
		width: 100%;
	}

	form {
		margin: 0;
	}

	.credit-notice {
		margin-bottom: 0.75rem;
	}
}

.starter-prompts {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.45rem;
	width: min(100%, 560px);
	margin-inline: auto;

	.starter-prompt-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.45rem;
	}

	.starter-prompt {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5625rem 1rem 0.4375rem;
		color: var(--assistant-text-soft);
		background: var(--assistant-surface);
		border: 1px solid var(--assistant-border);
		border-radius: 99px;
		font-size: 0.6875rem;
		line-height: 1.2;

		&:hover:not(:disabled) {
			color: var(--assistant-text);
			background: var(--assistant-raised);
			border-color: var(--assistant-border-hover);
		}

		&:disabled {
			opacity: 0.5;
			cursor: default;
		}
	}
}

.message {
	display: grid;
	gap: 0.45rem;
	width: 100%;
	font-size: 0.84rem;

	p {
		margin: 0;
		line-height: 1.55;
		white-space: pre-wrap;
	}

	&.user {
		justify-items: end;

		p {
			max-width: 85%;
			padding: 0.62rem 0.78rem;
			color: var(--assistant-text);
			background: var(--assistant-raised);
			border: 1px solid var(--assistant-border);
			border-radius: 12px;
		}
	}

	&.assistant {
		color: var(--assistant-text-soft);
	}
}


.message-markdown {
	min-width: 0;
	line-height: 1.55;
	overflow-wrap: anywhere;

	> :first-child {
		margin-top: 0;
	}

	> :last-child {
		margin-bottom: 0;
	}

	p {
		margin: 0.65em 0;
		white-space: normal;
	}

	ul, ol {
		margin: 0.65em 0;
		padding-left: 1.5em;
	}

	li + li {
		margin-top: 0.2em;
	}

	h1, h2, h3, h4, h5, h6 {
		margin: 1em 0 0.4em;
		color: var(--assistant-text);
		line-height: 1.3;
	}

	a {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	code {
		padding: 0.1em 0.3em;
		border-radius: 4px;
		background: var(--assistant-raised);
	}

	pre {
		overflow-x: auto;
		padding: 0.7rem;
		border-radius: 6px;
		background: var(--assistant-raised);
	}

	pre code {
		padding: 0;
		background: transparent;
	}

	blockquote {
		margin: 0.65em 0;
		padding-left: 0.75rem;
		border-left: 2px solid var(--assistant-border);
	}
}

.thought {
	display: grid;
	gap: 0.35rem;
}

[data-slot="reasoning-text"] {
	mask-image: linear-gradient(to bottom, transparent 0.5rem, black 1.5rem);

	&[data-compact] {
		max-block-size: calc(3lh + 1rem);
		overflow: hidden;
	}
}

[data-slot="reasoning-trigger"] {
	& > [data-slot="reasoning-trigger-chevron"] {
		transform: rotate(-90deg);
		transition: transform var(--animation-duration) ease;

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}

	&[aria-expanded="true"] > [data-slot="reasoning-trigger-chevron"] {
		transform: rotate(0);
	}
}

.thinking-indicator {
	padding: 0.1rem 0;
	font-size: 0.76rem;
}

.message.assistant:has(.tool-group[data-running]) .thinking-indicator {
	display: none;
}

.tool-group {
	color: var(--assistant-muted);
	font-size: 0.76rem;
}

.tool-activity {
	display: grid;
	gap: 0.3rem;
}

.assistant-choice {
	display: grid;
	gap: 0.5rem;
	color: var(--assistant-text-soft);
}

.tool-step {
	display: grid;
	grid-template-columns: 0.75rem minmax(0, 1fr);
	gap: 0.28rem;
	color: var(--assistant-muted);
	line-height: 1.45;

	> span:first-child,
	> svg:first-child {
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

	&[data-status="running"] > span {
		width: 0.28rem;
		height: 0.28rem;
		margin: 0.4rem 0.22rem;
		border-radius: 50%;
		background: var(--assistant-text-soft);
		animation: activity-pulse 1.2s ease-in-out infinite;
	}

	&[data-status="failed"] > svg:first-child {
		color: #f28b82;
	}
}

.timeline-update {
	display: inline-flex;
	align-items: center;
	justify-self: start;
	gap: 0.5rem;
	max-width: 100%;
	padding: 0.25rem 0;
	color: var(--assistant-muted);
	font-size: 0.84rem;

	> svg {
		width: 0.875rem;
		height: 0.875rem;
		color: #10b981;
	}
}

.undo-changes {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	width: max-content;
	margin-left: 0.18rem;
	padding: 0.16rem 0.38rem;
	color: var(--assistant-text-soft);
	background: var(--assistant-raised);
	border-radius: 99px;
	font-size: 0.7rem;

	svg {
		width: 0.68rem;
		height: 0.68rem;
		stroke-width: 1.8;
	}

	&:hover:not(:disabled) {
		background: var(--assistant-raised);
	}
}

@keyframes activity-pulse {
	50% {
		box-shadow: 0 0 0 0.3rem #7ba98a22;
	}
}

.message-actions {
	display: flex;
	align-items: center;
	gap: 0.1rem;
	min-height: 1.5rem;
	color: var(--assistant-faint);
	opacity: 0;
	transition: opacity 120ms ease;

	.message:hover &, .message:focus-within & {
		opacity: 1;
	}

	button {
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		padding: 0;
		border-radius: 6px;

		&:disabled {
			display: none;
		}

		&[data-copied] {
			color: #8fc7a4;
		}
	}

	svg {
		width: 0.88rem;
		height: 0.88rem;
		stroke-width: 1.7;
	}
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

.composer-area {
	min-width: 0;
}

.composer-shell > .starter-prompts {
	margin-bottom: 0.75rem;
}

.credit-notice {
	margin: 0 0.75rem;
	text-align: center;
	color: var(--assistant-muted);
	font-size: 12px;
	line-height: 1.5;

	a {
		color: var(--assistant-text);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
}

.credit-balance {
	border: 0;
	background: transparent;
	cursor: pointer;
	font-family: inherit;
	grid-column: 2;
	justify-self: end;
	padding: 2px 4px;
	color: var(--assistant-muted);
	font-size: 12px;
	line-height: 1.2;
	text-decoration: none;
	white-space: nowrap;

	&:hover {
		color: var(--assistant-text);
		text-decoration: underline;
	}

	&:focus-visible {
		outline: 1px solid currentColor;
		outline-offset: 2px;
	}
}

.credit-popover {
	--max-width: min(280px, calc(100vw - 32px));

	&::part(body) {
		padding: 16px;
		border: 1px solid var(--assistant-border);
		border-radius: 10px;
		background: var(--assistant-surface);
		color: var(--assistant-text);
		box-shadow: 0 8px 28px #0006;
	}
}
.credit-breakdown {
	font-size: 12px;
	line-height: 1.6;

	> strong {
		font-size: 15px;
		font-weight: 500;
	}

	dl {
		display: grid;
		gap: 8px;
		margin: 14px 0;
	}

	dl > div {
		display: flex;
		justify-content: space-between;
		gap: 24px;
	}

	dt, p {
		color: var(--assistant-muted);
	}

	dd {
		margin: 0;
		font-variant-numeric: tabular-nums;
	}

	p {
		margin: 8px 0;
	}

	a {
		display: inline-block;
		margin-top: 6px;
		color: var(--assistant-text);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
}

form {
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto auto;
	align-items: center;
	gap: 0.45rem;
	margin: 0.75rem;
	padding: 0.55rem;
	background: var(--assistant-surface);
	border-radius: 14px;
	box-shadow: 0 8px 24px #0004;
	transition: border-color 120ms ease, box-shadow 120ms ease;

	&:focus-within {
		border-color: var(--assistant-border-hover);
		box-shadow: 0 8px 24px #0004, 0 0 0 1px #ffffff08;
	}
}

[data-slot="composer-trigger-popover"] {
	max-height: 16rem;
	overflow-y: auto;
}

.mention-option-label {
	width: 100%;
	min-width: 0;

	> span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.mention-option-location {
	flex: none;
	margin-left: auto;
	color: var(--assistant-muted);
	font-size: 10px;
}

.composer-context {
	grid-column: 1 / -1;
	display: flex;
	gap: 0.35rem;
	min-width: 0;
	padding: 0.1rem 0.3rem;
	color: var(--assistant-muted);
	font-size: 11px;

	> span {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		min-width: 0;
		padding: 0.2rem 0.4rem;
		border-radius: 5px;
		background: #ffffff0d;
		white-space: nowrap;
	}

	> span:first-child {
		flex: none;
	}

	.composer-selection > span {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	svg {
		width: 12px;
		height: 12px;
		flex: none;
	}
}

.aui-lexical-editor {
	grid-column: 1 / -1;
	position: relative;
	min-width: 0;
	max-height: 9rem;
}

.aui-lexical-input {
	min-height: 3rem;
	padding: 0.25rem 0.3rem;
	color: var(--assistant-text);
	text-align: start;
	line-height: 1.45;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
	outline: none;

	p {
		margin: 0;
	}
}
.aui-lexical-placeholder {
	position: absolute;
	top: 0.25rem;
	left: 0.3rem;
	color: var(--assistant-muted);
	pointer-events: none;
}

.aui-directive-chip, .mention-chip {
	color: #8ebcff;
	background: #577bb42b;
	border-radius: 4px;
	padding: 0.05em 0.25em;
}

.aui-directive-chip::before {
	content: "@";
}

textarea {
	grid-column: 1 / -1;
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

	&::placeholder {
		color: var(--assistant-muted);
	}

	&:focus {
		outline: none;
	}
}

textarea:disabled,
.thinking-effort button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.thinking-effort {
	grid-column: 1;
	justify-self: start;
	width: max-content;
	font-size: 0.82rem;

	button {
		display: inline-flex;
		width: max-content;
		align-items: center;
		gap: 0.22rem;
		padding: 0.3rem 0.4rem;
		color: var(--assistant-text-soft);
		border-radius: 6px;
	}

	button span {
		color: var(--assistant-faint);
		font-size: 1rem;
		line-height: 0.6;
	}

	&::part(menu) {
		min-width: 7rem;
		padding: 0.2rem;
		background: #202020;
		border: 1px solid var(--assistant-border);
		border-radius: 8px;
		box-shadow: 0 10px 26px #0008;
	}
}

.thinking-check {
	display: inline-block;
	width: 1rem;
	color: #91c7aa;
}

.send {
	display: grid;
	grid-column: 3;
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

	&:hover:not(:disabled) {
		color: #0b0b0b;
		background: #969696;
	}

	&:disabled {
		color: var(--assistant-faint);
		background: #292929;
		cursor: default;
	}
}

@media (max-width: 600px) {
	:host {
		inset: 42px 0 auto;
		width: auto;
		height: calc(100vh - 42px);
		min-width: 0;
		min-height: 0;
		max-width: none;
		max-height: none;
		resize: none;
	}

	:host([data-minimized]) {
		height: 48px;
		min-height: 48px;
	}

	.assistant-panel {
		height: 100%;
		border-radius: 0;
	}

	.assistant-panel[data-fullscreen] {
		grid-template-columns: minmax(150px, 40vw) minmax(0, 1fr);
	}

	header {
		cursor: default;
		touch-action: auto;
	}
}

:host([data-fullscreen]) {
	position: fixed !important;
	inset: 0 !important;
	width: 100vw !important;
	height: 100vh !important;
	height: 100dvh !important;
	min-width: 0 !important;
	min-height: 0 !important;
	max-width: none !important;
	max-height: none !important;
	resize: none !important;
	z-index: 1000;

	.assistant-panel {
		border-radius: 0;
	}
}

}`
