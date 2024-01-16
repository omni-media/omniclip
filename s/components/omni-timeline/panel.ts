import {html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {shadow_view} from "../../context/slate.js"
import timelineSvg from "../../icons/gravity-ui/timeline.svg.js"

export const TimelinePanel = panel({
	label: "Timeline",
	icon: timelineSvg,
	view: shadow_view({name: "timeline", styles}, _use => ({}: any) => {
		return html`
			<omni-timeline></omni-timeline>
		`
	}),
})
