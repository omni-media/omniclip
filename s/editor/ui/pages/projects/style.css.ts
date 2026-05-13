import {css} from 'lit'

export default css`@layer view {

:host {
	display: flex;
	flex: 1;
	min-height: 0;
	color: #edf3fb;
	background: #060a10;
}

.project-hub {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 0;
	overflow: auto;
	background:
		radial-gradient(circle at 50% -12rem, #18233a 0, transparent 44rem),
		linear-gradient(180deg, #080d15 0, #05080d 100%);
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
	grid-template-columns: minmax(240px, 1fr) minmax(320px, 520px) minmax(340px, 1fr);
	align-items: center;
	gap: 24px;
	min-height: 92px;
	padding: 20px 56px;
	border-bottom: 1px solid #1a2230;
	background: #070b12d9;
	backdrop-filter: blur(18px);
}

.brand {
	display: inline-flex;
	align-items: center;
	gap: 12px;
	color: inherit;
	text-decoration: none;

	strong {
		font-size: var(--font-size-xl);
		letter-spacing: 0;
	}

	span {
		margin-left: 8px;
		color: #8993a2;
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.04em;
	}
}

.logo-mark {
	width: 32px;
	height: 32px;
	border-radius: 10px;
	background:
		linear-gradient(135deg, #2c8cff, #7a5cff),
		#1a5cff;
	box-shadow: 0 0 22px #2c8cff55;
}

.search {
	display: flex;
	align-items: center;
	height: 50px;
	padding: 0 16px;
	border: 1px solid #202938;
	border-radius: 12px;
	background: #0b1019;
	box-shadow: inset 0 1px 0 #ffffff05;

	span {
		width: 16px;
		height: 16px;
		margin-right: 12px;
		border: 2px solid #8792a2;
		border-radius: 50%;
		opacity: 0.8;

		&::after {
			content: "";
			display: block;
			width: 7px;
			height: 2px;
			margin: 11px 0 0 10px;
			border-radius: 999px;
			background: #8792a2;
			transform: rotate(45deg);
		}
	}

	input {
		min-width: 0;
		width: 100%;
		height: 100%;
		color: #edf3fb;
		background: transparent;
		border: 0;
		outline: 0;

		&::placeholder {
			color: #8792a2;
		}
	}
}

.controls {
	display: flex;
	align-items: center;
	justify-content: end;
	gap: 16px;
}

.sort {
	display: flex;
	align-items: center;
	gap: 10px;
	height: 50px;
	padding: 0 14px;
	border: 1px solid #202938;
	border-radius: 12px;
	background: #0b1019;
	color: #8993a2;

	select {
		color: #edf3fb;
		background: transparent;
		border: 0;
		outline: 0;
	}

	option {
		color: #111722;
	}
}

.view-toggle,
.icon-button {
	height: 50px;
	border: 1px solid #202938;
	border-radius: 12px;
	background: #0b1019;
}

.view-toggle {
	display: grid;
	grid-template-columns: 1fr 1fr;
	overflow: hidden;

	button {
		display: grid;
		place-items: center;
		min-width: 52px;
		background: transparent;
		color: #96a1b1;

		&[data-active] {
			color: #2f8cff;
			background: #111a29;
		}
	}
}

.icon-button {
	display: grid;
	place-items: center;
	min-width: 52px;
	background: transparent;
	color: #96a1b1;

	svg {
		width: 18px;
		height: 18px;
		fill: currentColor;
	}
}

.hub-content {
	width: min(100%, 1400px);
	margin: 0 auto;
	padding: 28px 32px 24px;
}

.actions {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 28px;
	margin-bottom: 28px;
}

.action-card {
	display: flex;
	align-items: center;
	gap: 28px;
	min-height: 112px;
	padding: 22px 26px;
	border: 1px solid #263044;
	border-radius: 14px;
	background: linear-gradient(135deg, #101727, #0d121c);
	text-align: left;
	box-shadow: inset 0 1px 0 #ffffff08;

	&.primary {
		border-color: #2157a6;
		background: linear-gradient(135deg, #122a57, #0d1424 72%);
		box-shadow: inset 0 1px 0 #ffffff0a, 0 0 28px #1e6fff24;
	}

	&.blue .action-icon {
		color: #3b90ff;
	}

	&.purple .action-icon {
		color: #9a63ff;
		background: #251a42;
	}

	&:hover {
		border-color: #3a5f9b;
	}

	strong,
	small {
		display: block;
	}

	strong {
		font-size: var(--font-size-l);
	}

	small {
		margin-top: 8px;
		color: #9aa5b5;
		font-size: var(--font-size-s);
	}
}

.action-icon {
	display: grid;
	place-items: center;
	flex: 0 0 auto;
	width: 68px;
	height: 68px;
	border: 1px solid #2c5cac;
	border-radius: 10px;
	background: #142449;
	color: #367dff;

	svg {
		width: 34px;
		height: 34px;
		fill: currentColor;
	}
}

.project-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 14px 18px;
}

.project-card {
	overflow: hidden;
	border: 1px solid #263044;
	border-radius: 12px;
	background: linear-gradient(180deg, #101722, #0b111a);
	box-shadow: inset 0 1px 0 #ffffff07;

	&:hover {
		border-color: #3c5f91;
		box-shadow: inset 0 1px 0 #ffffff09, 0 0 24px #2d8cff18;
	}
}

.thumbnail {
	position: relative;
	aspect-ratio: 16 / 6;
	background-color: #111923;
	background-position: center;
	background-size: cover;

	&::after {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 35%, #04070ccc 100%);
	}
}

.duration {
	position: absolute;
	right: 12px;
	bottom: 12px;
	z-index: 1;
	padding: 4px 8px;
	border-radius: 6px;
	background: #04070cdd;
	color: #f3f7fb;
	font-size: var(--font-size-xs);
}

.overflow {
	position: absolute;
	top: 10px;
	right: 10px;
	z-index: 1;
	display: grid;
	place-items: center;
	width: 36px;
	height: 32px;
	border-radius: 9px;
	background: #070b12b3;
	color: #e6edf7;
	font-size: var(--font-size-l);
	letter-spacing: 1px;
}

.project-body {
	padding: 14px 16px 16px;
}

.project-title {
	display: flex;
	align-items: center;
	gap: 8px;
	min-width: 0;

	h2 {
		overflow: hidden;
		color: #f2f6fb;
		font-size: var(--font-size-m);
		font-weight: 700;
		line-height: 1.25;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.favorite {
	display: grid;
	place-items: center;
	width: 17px;
	height: 17px;
	color: #348dff;

	svg {
		width: 16px;
		height: 16px;
		fill: currentColor;
	}
}

.metadata {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	margin-top: 8px;
	color: #97a2b2;
	font-size: var(--font-size-s);

	span:not(:last-child)::after {
		content: "•";
		margin-left: 6px;
		color: #4b5565;
	}
}

.edited {
	margin-top: 8px;
	color: #7f8998;
	font-size: var(--font-size-s);
}

.timeline-strip {
	display: flex;
	align-items: end;
	gap: 2px;
	height: 42px;
	margin-top: 14px;
	padding: 5px;
	overflow: hidden;
	border: 1px solid #1e2735;
	border-radius: 6px;
	background:
		linear-gradient(180deg, #0d1520, #0a1018),
		#0d1520;

	&::after {
		content: "";
		flex: 1 0 32px;
		height: 7px;
		border-radius: 2px;
		background: #2b3442;
	}
}

.clip {
	display: block;
	height: 100%;
	min-width: 9px;
	border-radius: 2px;
	opacity: 0.86;
}

.clip-0 { background: linear-gradient(180deg, #334c72, #1d2e44); }
.clip-1 { background: linear-gradient(180deg, #5e3fb4, #8d52d8); }
.clip-2 { background: linear-gradient(180deg, #1e897e, #35c0a8); }
.clip-3 { background: linear-gradient(180deg, #2d71c8, #3f8cff); }

.local-status {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	margin: 34px 0 0;
	color: #858f9f;
	font-size: var(--font-size-s);

	i {
		width: 1px;
		height: 18px;
		background: #2a3341;
	}
}

.status-dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: #35c778;
	box-shadow: 0 0 14px #35c77866;
}

.empty-state {
	display: grid;
	place-items: center;
	min-height: 320px;
	color: #9ba6b6;
	text-align: center;

	h1 {
		color: #edf3fb;
		font-size: var(--font-size-xl);
	}

	p {
		margin-top: 8px;
	}
}

.drawer-layer {
	position: fixed;
	inset: 0;
	z-index: 20;
	display: flex;
	justify-content: end;
	background: #02050a8c;
	backdrop-filter: blur(5px);
}

.details-drawer {
	width: min(420px, 100%);
	height: 100%;
	overflow: auto;
	padding: 22px;
	border-left: 1px solid #263044;
	background: #090e16;
	box-shadow: -24px 0 70px #0008;

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 18px;

		h2 {
			font-size: var(--font-size-l);
		}
	}
}

.close {
	display: grid;
	place-items: center;
	width: 36px;
	height: 36px;
	border-radius: 8px;
	background: #111824;
	color: #9da7b6;
	font-size: var(--font-size-xl);
}

.drawer-thumbnail {
	aspect-ratio: 16 / 9;
	border: 1px solid #263044;
	border-radius: 12px;
	background-position: center;
	background-size: cover;
}

.drawer-summary {
	margin-top: 18px;

	h3 {
		font-size: var(--font-size-xl);
	}

	p {
		margin-top: 8px;
		color: #a5afbf;
		line-height: 1.6;
	}
}

.drawer-stats {
	display: grid;
	gap: 12px;
	margin-top: 22px;
	padding: 18px 0;
	border-top: 1px solid #202938;
	border-bottom: 1px solid #202938;

	div {
		display: grid;
		grid-template-columns: 110px minmax(0, 1fr);
		gap: 14px;
		font-size: var(--font-size-s);
	}

	span {
		color: #8792a2;
	}

	strong {
		overflow: hidden;
		color: #edf3fb;
		font-weight: 500;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.drawer-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-top: 18px;

	span {
		padding: 6px 9px;
		border-radius: 8px;
		background: #13233a;
		color: #66adff;
		font-size: var(--font-size-xs);
	}
}

.drawer-actions {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	margin-top: 24px;

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 42px;
		padding: 0 14px;
		border: 1px solid #263044;
		border-radius: 9px;
		background: #101722;
		color: #d9e1ec;
	}

	.primary {
		border-color: #2368c8;
		background: #12305c;
		color: #edf6ff;
	}

	.danger {
		color: #ff5c5c;
	}

	svg {
		width: 16px;
		height: 16px;
		fill: currentColor;
	}
}

@media (max-width: 1180px) {
	.topbar {
		grid-template-columns: 1fr;
		align-items: stretch;
		gap: 14px;
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
		padding: 16px;
	}

	.brand {
		flex-wrap: wrap;

		strong {
			font-size: var(--font-size-xl);
		}
	}

	.controls {
		flex-wrap: wrap;
	}

	.hub-content {
		padding: 22px 16px;
	}

	.actions,
	.project-grid {
		grid-template-columns: 1fr;
	}

	.action-card {
		min-height: 96px;
		gap: 18px;
	}

	.thumbnail {
		aspect-ratio: 16 / 7;
	}

	.local-status {
		flex-wrap: wrap;
	}
}

}`
