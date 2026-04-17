import {html} from "lit"
import {shadow, useCss, useShadow, dom} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"
import arrowRightSvg from "../../../editor/ui/icons/gravity-ui/arrow-right.svg.js"

export const Nav = shadow((getSection: (id: string) => HTMLElement | undefined) => {
	useCss(themeCss, styleCss)

	const scrollIntoElementView = async (e: Event) => {
		const target = e.target as HTMLAnchorElement
		getDrawer().hide()
		const id = target.hash.slice(1)
		const section = getSection(id)
		if(section?.id === id) {
			section.scrollIntoView({behavior: "smooth"})
		} else if(id === "hero") {
			window.scrollTo({top: 0, behavior: "smooth"})
		}
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

	function getDrawer() {
		const drawer = dom("sl-drawer", useShadow()) as any
		const closeBtn = dom('sl-button[variant="primary"]', drawer)
 		closeBtn?.addEventListener("click", () => drawer.hide())
 		return drawer
	}

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
				<img class="menu-icon mobile-only" src="/assets/hamburger.svg" @click=${async () => getDrawer().show()}>
			</div>
		</nav>
	`
})
