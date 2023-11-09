import {svg, html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {shadow_view} from "../../context/slate.js"

export const AboutPanel = panel({
	label: "about",
	icon: svg``,
	view: shadow_view({name: "about", styles}, _use => ({}: any) => {
		return html`
			<h1>about</h1>
		`
	}),
})
