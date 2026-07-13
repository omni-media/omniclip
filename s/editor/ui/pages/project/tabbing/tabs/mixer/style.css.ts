
import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #151515;
	color: #cfcfcf;
}

.mixer {
	display: flex;
	flex-direction: column;
	height: 100%;
}

header {
	display: flex;
	align-items: center;
	min-height: 32px;
	padding: 0 0.75em;
	background: #1d1d1d;
	border-bottom: 1px solid #101010;
}

h3 {
	color: #d8d8d8;
	font-size: var(--font-size-xs);
	font-weight: 500;
}

.strips {
	display: flex;
	flex: 1;
	gap: 0.35em;
	padding: 0.5em;
	overflow-x: auto;
	overflow-y: hidden;
}

.strip {
	display: grid;
	grid-template-rows: auto auto minmax(0, 1fr) auto;
	gap: 0.45em;
	min-width: 5.6em;
	padding: 0.45em;
	background:
		linear-gradient(color-mix(in srgb, var(--role-color), transparent 84%), transparent),
		#202020;
	border: 1px solid #303030;
	border-radius: 5px;
}

.strip[data-disabled] {
	opacity: 0.55;
}

.strip-top {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.1em;
	min-height: 3em;
}

.strip-top strong {
	max-width: 100%;
	overflow: hidden;
	color: #e2e2e2;
	font-size: var(--font-size-xs);
	font-weight: 500;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.strip-top span,
footer {
	color: #aaa;
	font-size: calc(var(--font-size-xs) - 1px);
}

.strip-buttons {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.25em;
}

wa-button::part(base) {
	min-height: 1.8em;
	padding: 0;
	color: #aaa;
	background: #2b2b2b;
	border-color: #3a3a3a;
	border-radius: 3px;
	font-size: calc(var(--font-size-xs) - 1px);
}

wa-button[data-active]::part(base) {
	color: #eee;
	background: color-mix(in srgb, var(--role-color), #333 54%);
	border-color: color-mix(in srgb, var(--role-color), #555 45%);
}

.fader-row {
	display: grid;
	grid-template-columns: minmax(0, 1fr) 0.85em;
	align-items: center;
	justify-items: center;
	gap: 0.45em;
	min-height: 8em;
}

wa-slider {
	height: 100%;
	min-height: 7em;
	--track-color-active: color-mix(in srgb, var(--role-color), #d8d8d8 20%);
}

.meter {
	display: flex;
	align-items: end;
	width: 100%;
	height: 100%;
	min-height: 7em;
	padding: 2px;
	background: #111;
	border: 1px solid #292929;
	border-radius: 2px;
}

.meter div {
	width: 100%;
	background: linear-gradient(#d6b45e, #4fa262 35%, #285f42);
	border-radius: 1px;
}

footer {
	display: flex;
	justify-content: center;
}

}`

