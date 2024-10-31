import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/context.js"
import {AddTrackIndicator} from "../indicators/add-track-indicator.js"
import {getEffectsOnTrack} from "../../../../context/controllers/timeline/utils/get-effects-on-track.js"

export const Track = shadow_view(use => (index :number) => {
	use.styles(styles)
	const track_effects = getEffectsOnTrack(use.context.state, index)

	const if_text_on_track_styles = () => {
		return track_effects.some(effect => effect.kind === "text") && !track_effects.some(effect => effect.kind !== "text")
			? `height: 30px;`
			: "height: 50px;"
	}

	return html`
		<div style="${if_text_on_track_styles()}" class=track></div>
		<div class="indicators">
			${AddTrackIndicator()}
		</div>
	`
})
