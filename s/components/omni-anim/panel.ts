import {html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {shadow_view} from "../../context/context.js"
import animationSvg from "../../icons/material-design-icons/animation.svg.js"

export const AnimPanel = panel({
	label: "Animations",
	icon: animationSvg,
	view: shadow_view(use => ({}: any) => {
		use.styles(styles)
		use.name("animations")
		return html`
			<omni-anim></omni-anim>
		`
	}),
})
