import {html} from "lit"
import {ShinyDrawer, DrawerControl} from "@e280/shiny"
import {shadowElement, useCss, useName, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../theme.css.js"
import type {AppRouter} from "../pages/router.js"

import "@awesome.me/webawesome/dist/components/dialog/dialog.js"
import "@awesome.me/webawesome/dist/components/button/button.js"

export const EditorApp = (router: AppRouter) => shadowElement(() => {
	useName("editor-app")
	useCss(themeCss, styleCss)

	const drawer = useOnce(() => new DrawerControl())

	function renderLink(label: string, href: string, active: boolean) {
		const className = active ? "active" : ""
		const click = () => drawer.close()
		return html`
			<a
				href="${href}"
				class="${className}"
				@click="${click}">
					${label}
			</a>`
	}

	return ShinyDrawer.with({
		props: [{button: true, control: drawer}],
		attrs: {
			"data-projects": router.$hash() === "projects",
		},
		children: html`
			<span slot="button" class="navigation-trigger" title="Open navigation">
			<span class="navigation-label">Open navigation</span>
			<span class="editor-menu-brand" aria-hidden="true">
				<img src="/assets/logo/omni.png" alt="" />
				<span>Omniclip</span>
				<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
			</span>
			</span>

			<nav>
				<h2>
					<span>Omniclip</span>
					<button class="drawer-close" title="Close navigation" @click=${drawer.close}>×</button>
				</h2>
				${renderLink("About", router.href.home(), router.$hash() === "")}
				${renderLink("Account", router.href.account(), router.$hash() === "account")}
				${renderLink("Project List", router.href.projects(), router.$hash() === "projects")}
			</nav>

			<section slot=plate>
				${router.$content()}
			</section>
		`,
	})
})
