import {html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {shadow_view} from "../../context/context.js"
import animationSvg from "../../icons/material-design-icons/animation.svg.js"

export const FiltersPanel = panel({
	label: "Filters",
	icon: animationSvg,
	view: shadow_view(use => ({}: any) => {
		use.styles(styles)
		use.name("filters")
		return html`
			<omni-filters></omni-filters>
		`
	}),
})
