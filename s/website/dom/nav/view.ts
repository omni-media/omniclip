import {html, shadowView} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"
import arrowRightSvg from "../../../editor/dom/icons/gravity-ui/arrow-right.svg.js"

export const Nav = shadowView(use => () => {
	use.styles(themeCss, styleCss)
	const scrollIntoElementView = (v: string) => {}

	const renderLinks = () => html`
		<a @click=${() => scrollIntoElementView("welcome")} href="#welcome">Home</a>
		<a @click=${() => scrollIntoElementView("capabilities")} href="#capabilities">Features</a>
		<a @click=${() => scrollIntoElementView("coming-soon")} href="#coming-soon">Coming Soon</a>
	`

	return html`
		<nav>
			<div class="left">
				<img class="logo" src="/assets/logo/icon5.png" />
			</div>
			<div class="center desktop-only">
				${renderLinks()}
			</div>
			<div class="right">
				<a class="try" href="#/editor">Open Editor ${arrowRightSvg}</a>
				<img class="menu-icon mobile-only" src="/assets/hamburger.svg" @click=${() => {}} />
			</div>
			<div class="mobile-menu" data-opened="false">
				${renderLinks()}
				<a class="try" href="#/editor">Open Editor ${arrowRightSvg}</a>
			</div>
		</nav>
	`
})

