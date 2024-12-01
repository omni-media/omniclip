import {html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {shadow_view} from "../../context/context.js"
import transitionSvg from "../../icons/transition.svg.js"

export const TransitionsPanel = panel({
	label: "Transitions",
	icon: transitionSvg,
	view: shadow_view(use => ({}: any) => {
		use.styles(styles)
		use.name("transitions")
		return html`
			<omni-transitions></omni-transitions>
		`
	}),
})
