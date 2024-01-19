import {html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {MediaPlayer} from "./view.js"
import {shadow_view} from "../../../../context/slate.js"
import videoPlayerSvg from "../../../../icons/carbon-icons/video-player.svg.js"

export const MediaPlayerPanel = panel({
	label: "Player",
	icon: videoPlayerSvg,
	view: shadow_view(use => ({}) => {
		use.name("media-player")
		use.styles(styles)
		return html`${MediaPlayer([])}`
	}),
})
