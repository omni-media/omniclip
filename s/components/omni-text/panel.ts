import {svg, html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {shadow_view} from "../../context/slate.js"

export const TextPanel = panel({
	label: "text",
	icon: svg``,
	view: shadow_view({name: "text", styles}, _use => ({}: any) => {
		return html`
			<omni-text></omni-text>
		`
	}),
})
