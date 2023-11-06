import {svg, html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {omnislate} from "../../slate.js"

export const AboutPanel = panel({
	label: "about",
	icon: svg``,
	view: omnislate.obsidian({name: "about", styles}, _use => ({}: any) => {
		return html`
			<h1>about</h1>
		`
	}),
})
