
import {html} from "lit"
import {dom, shadow, useCss, useShadow} from "@e280/sly"
import "@awesome.me/webawesome/dist/components/button/button.js"
import "@awesome.me/webawesome/dist/components/drawer/drawer.js"

import styleCss from "./style.css.js"

export const Hero = shadow((getSection: (id: string) => HTMLElement | undefined) => {
	useCss(styleCss)

	const scrollIntoElementView = (event: Event) => {
		const target = event.target as HTMLAnchorElement
		getDrawer().hide()
		const id = target.hash.slice(1)
		const section = getSection(id)

		if (section?.id === id)
			section.scrollIntoView({behavior: "smooth"})
	}

	const renderLinks = () => html`
		<a @click=${scrollIntoElementView} href="#features">features</a>
		<a @click=${scrollIntoElementView} href="#source">source</a>
		<a @click=${scrollIntoElementView} href="#history">history</a>
	`

	const mobileDrawer = () => html`
		<sl-drawer label="Menu" placement="top" class="drawer-overview">
			<div class="drawer-links">
				${renderLinks()}
				<a href="#/editor">open the editor</a>
			</div>
			<sl-button class="drawer-primary" slot="footer" variant="primary">Close</sl-button>
		</sl-drawer>
	`

	const shadow = useShadow()
	function getDrawer() {
		const drawer = dom("sl-drawer", shadow) as any
		const closeBtn = dom('sl-button[variant="primary"]', drawer)
		closeBtn?.addEventListener("click", () => drawer.hide())
		return drawer
	}

	return html`
		${mobileDrawer()}
		<header class="top">
			<div class="site-name">
				omniclip <span>v2.0</span>
			</div>
			<nav class="top-links" aria-label="Landing page sections">
				${renderLinks()}
			</nav>
			<button class="menu-button" type="button" aria-label="Open menu" @click=${() => getDrawer().show()}>
				<img src="/assets/hamburger.svg" alt="" />
			</button>
		</header>

		<section class="hero">
			<h1>A video editor<br>that runs in<br>your browser.</h1>
			<p class="intro">
				no install. no subscription. cut your footage, export your video, go on with your life.
				simple but powerful open source video editor.
			</p>

			<div class="cta-row">
				<a href="#/editor" class="btn">Open the editor</a>
				<a href="https://discord.gg/Nr8t9s5wSM" target="_blank" rel="noreferrer" class="btn-plain">Join Discord -&gt;</a>
			</div>

		</section>
	`
})

