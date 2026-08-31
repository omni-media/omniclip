
import {css} from "lit"
export default css`@layer view {

:host {
	display: block;

	width: 100%;
	height: 100%;
	margin: auto;
}

[view="shiny-drawer"] {
	display: block;
	width: 100%;
	height: 100%;
	--button-size: 2em;
	--drawer-height: 100%;
	--blanket-bg: rgb(0 0 0 / 0.35);
	--blanket-backdrop-filter: none;
	--slate-bg: #151515;
}

[view="shiny-drawer"]::part(button) {
	top: calc((36px - var(--button-size)) / 2);
	margin-left: 0.35em;
	color: #aaa;
	background: transparent;
	border-radius: 0.18em;
	opacity: 1;
	transition: background 0.12s ease, color 0.12s ease;
}

[view="shiny-drawer"][data-projects]::part(button) {
	top: calc((58px - var(--button-size)) / 2);
}

[view="shiny-drawer"]::part(button):hover {
	color: #e8e8e8;
	background: #333;
}

[view="shiny-drawer"]:state(opened)::part(button) {
	display: none;
}

[view="shiny-drawer"]::part(tray) {
	width: min(18em, calc(100% - var(--button-size)));
	z-index: 11;
}

[view="shiny-drawer"]::part(slate) {
	background: #151515;
	border-right: 1px solid #101010;
	box-shadow: 10px 0 24px rgb(0 0 0 / 0.25);
}

[view="shiny-drawer"]::part(blanket) {
	z-index: 10;
	background: rgb(0 0 0 / 0.35);
	backdrop-filter: none;
}

nav {
	display: flex;
	flex-direction: column;
	gap: 0.25em;
	padding: 0.75em;
	background: #151515;
	font-size: var(--font-size-s);
}

nav h2 {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75em;
	margin-bottom: 0.35em;
	padding: 0.25em 0.15em 0.6em 0.45em;
	color: #d8d8d8;
	border-bottom: 1px solid #252525;
	font-size: var(--font-size-s);
	font-weight: 600;
}

.drawer-close {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2em;
	height: 2em;
	color: #aaa;
	background: transparent;
	border: none;
	border-radius: 0.18em;
	cursor: pointer;
	font: inherit;
	line-height: 1;
}

.drawer-close:hover {
	color: #e8e8e8;
	background: #333;
}

nav a {
	padding: 0.5em 0.6em;
	color: #aaa;
	border-radius: 0.25em;
	text-decoration: none;
}

nav a:hover,
nav a.active {
	color: #e8e8e8;
	background: #2b2b2b;
	text-decoration: none;
}

section {
	width: 100%;
	height: 100%;
	background: #151515;

	> sly-shadow {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
}

}`
