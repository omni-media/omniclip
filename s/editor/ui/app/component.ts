import {html} from "lit"
import {ShinyDrawer, DrawerControl} from "@e280/shiny"
import {shadowElement, useCss, useName, useOnce} from "@e280/sly"
import styleCss from "./style.css.js"
import themeCss from "../../theme.css.js"
import {EditorContext} from "../../context/context.js"

import "@awesome.me/webawesome/dist/components/dialog/dialog.js"
import "@awesome.me/webawesome/dist/components/button/button.js"

export const EditorApp = (context: EditorContext) => shadowElement(() => {
	useName("editor-app")
	useCss(themeCss, styleCss)
	const {router} = context
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
		children: html`
			<nav>
				<h2>Omniclip</h2>
				${renderLink("About", router.href.home(), router.$hash() === "")}
				${renderLink("Account", router.href.account(), router.$hash() === "account")}
				${renderLink("Project List", router.href.projects(), router.$hash() === "projects")}
				${renderLink("Project", router.href.project("123"), router.$hash().startsWith("project/"))}
			</nav>

			<section slot=plate>
				${router.$content()}
			</section>

			${context.modals.render()}
		`,
	})
})
