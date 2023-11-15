import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {AddTrackIndicator} from "../indicators/add-track-indicator.js"

export const Track = shadow_view({styles}, use => () => {
	return html`
		<div class=track></div>
		<div class="indicators">
			${AddTrackIndicator()}
		</div>
	`
})
