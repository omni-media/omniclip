import {html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {shadow_view} from "../../context/context.js"
import audioSvg from "../../icons/carbon-icons/audio-console.js"

export const AudioPanel = panel({
	label: "Audio",
	icon: audioSvg,
	view: shadow_view(use => ({}: any) => {
		use.styles(styles)
		use.name("Audio")
		return html`
			<omni-audio></omni-audio>
		`
	}),
})
