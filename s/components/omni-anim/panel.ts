import {html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {shadow_view} from "../../context/context.js"
import textSvg from "../../icons/gravity-ui/text.svg.js"

export const AnimPanel = panel({
	label: "Animations",
	icon: textSvg,
	view: shadow_view(use => ({}: any) => {
		use.styles(styles)
		use.name("animations")
		return html`
			<omni-anim></omni-anim>
		`
	}),
})
