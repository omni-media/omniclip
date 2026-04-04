
import {html} from "lit"
import {Drawer} from "@e280/shiny"
import {spa, view} from "@e280/sly"
import styleCss from "./style.css.js"
import themeCss from "../../theme.css.js"
import {EditorContext} from "../../context/context.js"

import "@awesome.me/webawesome/dist/components/dialog/dialog.js"
import "@awesome.me/webawesome/dist/components/button/button.js"

export const EditorApp = (context: EditorContext) => view.component(use => {
	use.name("editor-app")
	use.styles(themeCss, styleCss)
	const {router, views} = context
	const drawer = use.once(() => new Drawer())

	function renderLink(label: string, navigable: spa.Navigable, hash = navigable.hash()) {
		const className = navigable.active ? "active" : ""
		const click = () => drawer.close()
		return html`
			<a
				href="${hash}"
				class="${className}"
				@click="${click}">
					${label}
			</a>`
	}

	return views.ShinyDrawer
		.props({button: true, drawer})
		.children(html`
			<nav>
				<h2>Omniclip</h2>
				${renderLink("About", router.nav.home)}
				${renderLink("Account", router.nav.account)}
				${renderLink("Project List", router.nav.projects)}
				${renderLink("Project", router.nav.project, router.nav.project.hash({projectId: "123"}))}
			</nav>

			<section slot=plate>
				${router.render()}
			</section>

			${context.modals.render()}
		`)
		.render()
})

