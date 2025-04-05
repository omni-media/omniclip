import {html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {shadow_view} from "../../context/context.js"
import textSvg from "../../icons/gravity-ui/text.svg.js"

export const TextPanel = panel({
	label: "Text",
	icon: textSvg,
	view: shadow_view(use => ({}: any) => {
		use.styles(styles)
		use.name("text")
		return html`
			<omni-text></omni-text>
		`
	}),
})
