import {css} from 'lit'

export default css`@layer view {

:host {
	display: flex;
	flex: 1;
	min-height: 0;
	color: #cfcfcf;
	background: #151515;
}

.project-hub {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 0;
	overflow: auto;
	background: #151515;
}

button,
input,
select {
	font: inherit;
}

button {
	color: inherit;
	border: 0;
	cursor: pointer;
}

.topbar {
	position: sticky;
	top: 0;
	z-index: 5;
	display: grid;
	grid-template-columns: minmax(220px, 1fr) minmax(260px, 520px) minmax(300px, 1fr);
	align-items: center;
	gap: 1em;
	min-height: 46px;
	padding: 0.35em 1em;
	border-bottom: 1px solid #101010;
	background: #181818;
}

.brand {
	display: inline-flex;
	align-items: center;
	gap: 0.65em;
	color: inherit;
	text-decoration: none;
}

.brand:hover {
	text-decoration: none;
}

.brand-copy {
	display: grid;
	gap: 0.15em;
	line-height: 1;

	strong {
		color: #e5e5e5;
		font-size: var(--font-size-m);
		font-weight: 600;
		letter-spacing: 0;
	}

	span {
		color: #8f8f8f;
		font-size: calc(var(--font-size-xs) - 1px);
		font-weight: 600;
		letter-spacing: 0.04em;
	}
}

.logo-mark {
	width: 24px;
	height: 24px;
	border: 1px solid #444;
	border-radius: 4px;
	background: #242424;
}

.search {
	display: flex;
	align-items: center;
	height: 32px;
	padding: 0 0.65em;
	border: 1px solid #242424;
	border-radius: 3px;
	background: #181818;
	color: #8f8f8f;

	span {
		width: 0.85em;
		height: 0.85em;
		margin-right: 0.55em;
		border: 1px solid #8f8f8f;
		border-radius: 50%;

		&::after {
			content: "";
			display: block;
			width: 0.4em;
			height: 1px;
			margin: 0.68em 0 0 0.58em;
			background: #8f8f8f;
			transform: rotate(45deg);
		}
	}

	input {
		min-width: 0;
		width: 100%;
		height: 100%;
		color: #d3d3d3;
		background: transparent;
		border: 0;
		outline: 0;
		font-size: var(--font-size-xs);

		&::placeholder {
			color: #777;
		}
	}
}

.search:focus-within {
	border-color: #575757;
}

.controls {
	display: flex;
	align-items: center;
	justify-content: end;
	gap: 0.45em;
}

.sort {
	display: flex;
	align-items: center;
	gap: 0.5em;
	height: 32px;
	padding: 0 0.55em;
	border: 1px solid #242424;
	border-radius: 3px;
	background: #181818;
	color: #8f8f8f;
	font-size: var(--font-size-xs);

	select {
		color: #d3d3d3;
		background: transparent;
		border: 0;
		outline: 0;
		font-size: var(--font-size-xs);
	}

	option {
		color: #d3d3d3;
		background: #181818;
	}
}

.view-toggle,
.icon-button {
	height: 32px;
	border: 1px solid #242424;
	border-radius: 3px;
	background: #181818;
}

.view-toggle {
	display: grid;
	grid-template-columns: 1fr 1fr;
	overflow: hidden;

	button {
		display: grid;
		place-items: center;
		min-width: 34px;
		background: transparent;
		color: #9a9a9a;

		&:hover {
			color: #e8e8e8;
			background: #2b2b2b;
		}

		&[data-active] {
			color: #e8e8e8;
			background: #303030;
		}
	}
}

.icon-button {
	display: grid;
	place-items: center;
	min-width: 34px;
	color: #9a9a9a;

	&:hover {
		color: #e8e8e8;
		background: #2b2b2b;
	}

	svg {
		width: 1em;
		height: 1em;
		fill: currentColor;
	}
}

.hub-content {
	width: min(100%, 1320px);
	margin: 0 auto;
	padding: 1.15em 1em 1em;
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1em;
	margin-bottom: 1em;

	h1 {
		color: #e5e5e5;
		font-size: var(--font-size-l);
		font-weight: 500;
		line-height: 1.1;
	}
}

.project-commands {
	display: flex;
	align-items: center;
	justify-content: end;
	gap: 0.5em;
}

.command-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.45em;
	min-height: 32px;
	padding: 0 0.75em;
	border: 1px solid #2b2b2b;
	border-radius: 3px;
	background: #181818;
	color: #cfcfcf;
	font-size: var(--font-size-xs);

	&.primary {
		background: #242424;
		color: #e8e8e8;
	}

	&:hover {
		border-color: #3a3a3a;
		background: #2b2b2b;
	}

	svg {
		width: 1em;
		height: 1em;
		fill: currentColor;
	}
}

.project-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0.75em;
}

.project-card {
	overflow: hidden;
	border: 1px solid #242424;
	border-radius: 4px;
	background: #181818;
	cursor: pointer;

	&:hover {
		border-color: #3a3a3a;
		background: #1b1b1b;
	}
}

.thumbnail {
	position: relative;
	aspect-ratio: 16 / 6;
	background-color: #101010;
	background-position: center;
	background-size: cover;

	&::after {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 40%, #050505cc 100%);
	}
}

.duration {
	position: absolute;
	right: 0.55em;
	bottom: 0.45em;
	z-index: 1;
	padding: 0.2em 0.45em;
	border-radius: 3px;
	background: #050505dd;
	color: #e5e5e5;
	font-size: var(--font-size-xs);
}

.overflow {
	position: absolute;
	top: 0.45em;
	right: 0.45em;
	z-index: 1;
	display: grid;
	place-items: center;
	width: 30px;
	height: 26px;
	border-radius: 3px;
	background: #101010cc;
	color: #cfcfcf;
	font-size: var(--font-size-m);
	letter-spacing: 1px;
}

.overflow:hover {
	background: #2b2b2b;
}

.project-body {
	padding: 0.65em 0.7em 0.7em;
}

.project-title {
	display: flex;
	align-items: center;
	gap: 0.45em;
	min-width: 0;

	h2 {
		overflow: hidden;
		color: #e0e0e0;
		font-size: var(--font-size-s);
		font-weight: 600;
		line-height: 1.25;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.favorite {
	display: grid;
	place-items: center;
	width: 1em;
	height: 1em;
	color: #d4b663;

	svg {
		width: 1em;
		height: 1em;
		fill: currentColor;
	}
}

.metadata {
	display: flex;
	flex-wrap: wrap;
	gap: 0.35em;
	margin-top: 0.45em;
	color: #8f8f8f;
	font-size: var(--font-size-xs);

	span:not(:last-child)::after {
		content: "•";
		margin-left: 0.35em;
		color: #555;
	}
}

.edited {
	margin-top: 0.35em;
	color: #777;
	font-size: var(--font-size-xs);
}

.timeline-strip {
	display: flex;
	align-items: end;
	gap: 2px;
	height: 34px;
	margin-top: 0.65em;
	padding: 4px;
	overflow: hidden;
	border: 1px solid #242424;
	border-radius: 3px;
	background: #151515;

	&::after {
		content: "";
		flex: 1 0 32px;
		height: 6px;
		border-radius: 1px;
		background: #2b2b2b;
	}
}

.clip {
	display: block;
	height: 100%;
	min-width: 9px;
	border-radius: 1px;
	opacity: 0.9;
}

.clip-0 { background: #516072; }
.clip-1 { background: #6f5b90; }
.clip-2 { background: #4f7d73; }
.clip-3 { background: #607a9a; }

.local-status {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.65em;
	margin: 1.2em 0 0;
	color: #777;
	font-size: var(--font-size-xs);

	i {
		width: 1px;
		height: 16px;
		background: #2b2b2b;
	}
}

.status-dot {
	width: 0.55em;
	height: 0.55em;
	border-radius: 50%;
	background: #6fa87a;
}

.empty-state {
	display: grid;
	place-items: center;
	min-height: 280px;
	color: #8f8f8f;
	text-align: center;

	h1 {
		color: #e5e5e5;
		font-size: var(--font-size-l);
		font-weight: 500;
	}

	p {
		margin-top: 0.5em;
		font-size: var(--font-size-xs);
	}
}

.drawer-layer {
	position: fixed;
	inset: 0;
	z-index: 20;
	display: flex;
	justify-content: end;
	background: #0008;
}

.details-drawer {
	width: min(420px, 100%);
	height: 100%;
	overflow: auto;
	padding: 1em;
	border-left: 1px solid #101010;
	background: #181818;
	box-shadow: -18px 0 46px #0008;

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75em;

		h2 {
			color: #e0e0e0;
			font-size: var(--font-size-m);
			font-weight: 500;
		}
	}
}

.close {
	display: grid;
	place-items: center;
	width: 30px;
	height: 30px;
	border-radius: 3px;
	background: #181818;
	color: #aaa;
	font-size: var(--font-size-l);
}

.close:hover {
	color: #e8e8e8;
	background: #2b2b2b;
}

.drawer-thumbnail {
	aspect-ratio: 16 / 9;
	border: 1px solid #242424;
	border-radius: 4px;
	background-position: center;
	background-size: cover;
}

.drawer-summary {
	margin-top: 0.85em;

	h3 {
		color: #e5e5e5;
		font-size: var(--font-size-l);
		font-weight: 500;
	}

	p {
		margin-top: 0.45em;
		color: #9a9a9a;
		font-size: var(--font-size-xs);
		line-height: 1.5;
	}
}

.drawer-stats {
	display: grid;
	gap: 0.55em;
	margin-top: 1em;
	padding: 0.9em 0;
	border-top: 1px solid #242424;
	border-bottom: 1px solid #242424;

	div {
		display: grid;
		grid-template-columns: 7em minmax(0, 1fr);
		gap: 0.75em;
		font-size: var(--font-size-xs);
	}

	span {
		color: #8f8f8f;
	}

	strong {
		overflow: hidden;
		color: #d8d8d8;
		font-weight: 500;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.drawer-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.45em;
	margin-top: 0.85em;

	span {
		padding: 0.3em 0.45em;
		border: 1px solid #2b2b2b;
		border-radius: 3px;
		background: #181818;
		color: #cfcfcf;
		font-size: var(--font-size-xs);
	}
}

.drawer-actions {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.5em;
	margin-top: 1em;

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.45em;
		min-height: 32px;
		padding: 0 0.7em;
		border: 1px solid #2b2b2b;
		border-radius: 3px;
		background: #181818;
		color: #cfcfcf;
		font-size: var(--font-size-xs);
	}

	button:hover {
		border-color: #3a3a3a;
		background: #2b2b2b;
	}

	.primary {
		background: #242424;
		color: #e8e8e8;
	}

	.danger {
		color: #ff9b9b;
	}

	svg {
		width: 1em;
		height: 1em;
		fill: currentColor;
	}
}

@media (max-width: 1180px) {
	.topbar {
		grid-template-columns: 1fr;
		align-items: stretch;
		gap: 0.55em;
	}

	.controls {
		justify-content: start;
	}

	.project-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 760px) {
	.topbar {
		padding: 0.65em;
	}

	.controls {
		flex-wrap: wrap;
	}

	.hub-content {
		padding: 0.85em 0.65em;
	}

	.section-header {
		align-items: stretch;
		flex-direction: column;
	}

	.project-commands {
		display: grid;
		grid-template-columns: 1fr;
	}

	.project-grid {
		grid-template-columns: 1fr;
	}

	.thumbnail {
		aspect-ratio: 16 / 7;
	}

	.local-status {
		flex-wrap: wrap;
	}
}

}`
