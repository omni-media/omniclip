import {svg, html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {MediaPlayer} from "./view.js"
import {shadow_view} from "../../../../context/slate.js"

export const MediaPlayerPanel = panel({
	label: "media-player",
	icon: svg``,
	view: shadow_view({name: "media-player", styles}, _use => ({}: any) => {
		return html`${MediaPlayer([])}`
	}),
})
