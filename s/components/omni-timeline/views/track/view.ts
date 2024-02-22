import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {AddTrackIndicator} from "../indicators/add-track-indicator.js"

export const Track = shadow_view({styles}, use => (index :number) => {
	const controller = use.context.controllers.timeline
	const track_effects = controller.get_effects_on_track(use.context.state.timeline, index)

	const if_text_on_track_styles = () => {
		return !track_effects.find(effect => effect.kind === "video") && track_effects.find(effect => effect.kind === "text")
			? `height: 30px;`
			: ""
	}

	return html`
		<div style="${if_text_on_track_styles()}" class=track></div>
		<div class="indicators">
			${AddTrackIndicator()}
		</div>
	`
})
