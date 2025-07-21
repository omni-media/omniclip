
import {html, shadowView} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"
import arrowRightSvg from "../../../editor/dom/icons/gravity-ui/arrow-right.svg.js"

export const Nav = shadowView(use => () => {
	use.styles(themeCss, styleCss)
	const scrollIntoElementView = (v: string) => {}

	return html`
		<nav>
			<img class="logo" src="/assets/logo/icon5.png" />
			<img @click=${() => {}} class="menu-icon" src="/assets/hamburger.svg">
			<div class="menu">
				<a @click=${() => scrollIntoElementView("welcome")} href="#welcome">Home</a>
				<a @click=${() => scrollIntoElementView("capabilities")} href="#capabilities">Features</a>
				<a @click=${() => scrollIntoElementView("coming-soon")} href="#coming-soon">Coming Soon</a>
				<a class="try" href="#/editor">Open Editor ${arrowRightSvg}</a>
			</div>
			<div class="nav">
				<a @click=${() => scrollIntoElementView("welcome")} href="#welcome">Home</a>
				<a @click=${() => scrollIntoElementView("capabilities")} href="#capabilities">Features</a>
				<a @click=${() => scrollIntoElementView("coming-soon")} href="#coming-soon">Coming Soon</a>
			</div>
			<div class="nav">
				<a class="try" href="#/editor">Open Editor ${arrowRightSvg}</a>
			</div>
		</nav>
`})
