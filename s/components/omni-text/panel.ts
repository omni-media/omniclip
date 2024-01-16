import {html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {shadow_view} from "../../context/slate.js"
import textSvg from "../../icons/gravity-ui/text.svg.js"

export const TextPanel = panel({
	label: "Text",
	icon: textSvg,
	view: shadow_view({name: "text", styles}, _use => ({}: any) => {
		return html`
			<omni-text></omni-text>
		`
	}),
})
