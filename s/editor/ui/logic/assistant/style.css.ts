
import {css} from "lit"

export default css`@layer view {

:host {
	position: fixed;
	top: 52px;
	right: 16px;
	z-index: 20;
	width: min(420px, calc(100vw - 32px));
}

.assistant-panel {
	display: grid;
	grid-template-rows: 50px minmax(0, 1fr) auto;
	width: 100%;
	height: min(640px, calc(100vh - 68px));
	overflow: hidden;
	color: #ddd;
	background: #141416;
	border: 1px solid #3a3a40;
	border-radius: 12px;
	box-shadow: 0 20px 60px #000b;
}

.assistant-panel[data-minimized] {
	height: 50px;
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
	padding-inline: 0.85rem 0.65rem;
	background: linear-gradient(120deg, #202127, #171719 70%);
	border-bottom: 1px solid #34343a;
}

header strong {
	gap: 0.55rem;
	font-size: 0.88rem;
}

header strong span {
	color: #4c9aff;
	font-size: 1.25rem;
}

button {
	color: #aaa;
	background: transparent;
	border: 0;
	font: inherit;
	cursor: pointer;
}

header button {
	width: 2rem;
	height: 2rem;
	border-radius: 5px;
	font-size: 1.1rem;
}

button:hover:not(:disabled) {
	color: #eee;
	background: #fff1;
}

.messages {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	overflow-y: auto;
	padding: 1rem;
}

.welcome {
	display: grid;
	justify-items: center;
	gap: 0.4rem;
	margin: auto;
	color: #888;
	font-size: 0.8rem;
}

.welcome strong {
	color: #ddd;
	font-size: 0.95rem;
}

article {
	display: grid;
	gap: 0.35rem;
	font-size: 0.8rem;
}

article strong {
	font-size: 0.72rem;
}

article p {
	margin: 0;
	line-height: 1.5;
	white-space: pre-wrap;
}

article.user {
	justify-items: end;
}

article.user p {
	max-width: 85%;
	padding: 0.55rem 0.7rem;
	background: #27272b;
	border: 1px solid #34343a;
	border-radius: 9px;
}

form {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: end;
	gap: 0.5rem;
	padding: 0.75rem;
	background: #18181b;
	border-top: 1px solid #303036;
}

form small {
	grid-column: 1 / -1;
	color: #888;
}

input {
	box-sizing: border-box;
	min-width: 0;
	height: 2.5rem;
	padding: 0.65rem 0.7rem;
	color: #ddd;
	background: #141416;
	border: 1px solid #34343a;
	border-radius: 8px;
	font: inherit;
}

input:focus {
	border-color: #477ac5;
	outline: none;
}

.send {
	width: 2.5rem;
	height: 2.5rem;
	color: #b8d5ff;
	background: #315fa5;
	border-radius: 8px;
}

.send:disabled {
	opacity: 0.4;
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
