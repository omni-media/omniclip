import {html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {shadow_view} from "../../context/context.js"
import folderSvg from "../../icons/gravity-ui/folder.svg.js"

export const MediaPanel = panel({
	label: "Media",
	icon: folderSvg,
	view: shadow_view(use => ({}: any) => {
		use.styles(styles)
		use.name("media")
		return html`
			<omni-media></omni-media>
		`
	}),
})
