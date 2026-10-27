
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
	--button-size: 2.3em;
	--drawer-height: 100%;
	--blanket-bg: rgb(0 0 0 / 0.35);
	--blanket-backdrop-filter: none;
	--slate-bg: #151515;
}

[view="shiny-drawer"]::part(button) {
	top: 6px;
	width: auto;
	height: 28px;
	margin-left: 0.5em;
	display: grid;
	place-items: center;
	padding: 0 7px;
	color: #777;
	background: transparent;
	border-radius: 5px;
	opacity: 1;
	transition: background 0.12s ease, color 0.12s ease;
}

[view="shiny-drawer"][data-projects]::part(button) {
	top: 15px;
}

[view="shiny-drawer"]::part(button):hover {
	color: #aaa;
	background: #ffffff09;
}

[view="shiny-drawer"]::part(button):focus-visible { outline: 2px solid #89b6ff; outline-offset: 2px; }

[view="shiny-drawer"]:state(opened)::part(button) {
	display: none;
}

[view="shiny-drawer"]::part(tray) {
	width: min(18em, calc(100% - var(--button-size)));
	z-index: 11;
}

[view="shiny-drawer"]::part(slate) {
	background: #151515;
	border-bottom-right-radius: 12px;
	overflow: hidden;
	border-right: 1px solid #ffffff08;
	box-shadow: 8px 0 28px rgb(0 0 0 / 0.2);
}

[view="shiny-drawer"]::part(blanket) {
	z-index: 10;
	background: rgb(0 0 0 / 0.35);
	backdrop-filter: none;
}

.navigation-trigger { display: flex; align-items: center; }
.navigation-label { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.editor-menu-brand { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: #d5d5d5; }
.editor-menu-brand img { width: 22px; height: 22px; object-fit: contain; }
.editor-menu-brand > svg { margin-left: 2px; color: #888; }

@media (max-width: 1023px) {
	.editor-menu-brand > span { display: none; }
}

nav {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 14px;
	background: #151515;
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	font-size: var(--font-size-s);
	text-shadow: none;
}

nav h2 {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75em;
	margin-bottom: 8px;
	padding: 2px 4px 12px 10px;
	color: #d8d8d8;
	border-bottom: 1px solid #ffffff08;
	font-size: var(--font-size-s);
	font-weight: 500;
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
	border-radius: 7px;
	cursor: pointer;
	font: inherit;
	line-height: 1;
	transition: background 140ms ease, color 140ms ease;
}

.drawer-close:hover {
	color: #e8e8e8;
	background: #252525;
}

nav a {
	padding: 10px;
	color: #aaa;
	border-radius: 7px;
	text-decoration: none;
	transition: background 140ms ease, color 140ms ease;
}

nav a:hover,
nav a.active {
	color: #e8e8e8;
	background: #252525;
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
