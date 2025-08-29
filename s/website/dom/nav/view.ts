import {html, shadowView} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"
import arrowRightSvg from "../../../editor/dom/icons/gravity-ui/arrow-right.svg.js"

export const Nav = shadowView(use => (elements: NodeListOf<HTMLElement>) => {
	use.styles(themeCss, styleCss)

	const scrollIntoElementView = (e: Event) => {
		const target = e.target as HTMLAnchorElement
		drawer.value.hide()
		const id = target.hash.slice(1)
		elements.forEach(item => {
			if(item.id === id) {
				item.scrollIntoView({behavior: "smooth"})
			} else if(id === "hero") {
				window.scrollTo({top: 0, behavior: "smooth"})
			}
		})
	}

	const renderLinks = () => html`
		<a @click=${scrollIntoElementView} href="#hero">Home</a>
		<a @click=${scrollIntoElementView} href="#features">Features</a>
		<a @click=${scrollIntoElementView} href="#developers">SDK</a>
	`

	const mobileDrawer = () => html`
		<sl-drawer label="Menu" placement="top" class="drawer-overview">
			<div class=drawer-links>
				${renderLinks()}
			</div>
  		<sl-button class="drawer-primary" slot="footer" variant="primary">Close</sl-button>
		</sl-drawer>`

	const drawer = use.deferOnce(() => {
		const drawer = use.shadow.querySelector("sl-drawer")! as any
 		const closeButton = drawer.querySelector('sl-button[variant="primary"]')
 		closeButton?.addEventListener("click", () => drawer.hide())
		return drawer
	})

	return html`
		${mobileDrawer()}
		<nav>
			<div class="left">
				<img class="logo" src="/assets/logo/icon5.png" />
			</div>
			<div class="center desktop-only">
				${renderLinks()}
			</div>
			<div class="right">
				<a class="try" href="#/editor">Open Editor ${arrowRightSvg}</a>
				<img class="menu-icon mobile-only" src="/assets/hamburger.svg" @click=${() => (drawer.value as any).show()}>
			</div>
		</nav>
	`
})

