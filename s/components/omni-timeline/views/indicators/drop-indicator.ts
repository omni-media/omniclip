import {html} from "@benev/slate"

import {light_view} from "../../../../context/slate.js"
import {calculate_track_clip_length} from "../../utils/calculate_track_clip_length.js"
import {calculate_closest_track_place} from "../../utils/calculate_closest_track_place.js"

export const DropIndicator = light_view(use => () => {
	const dnd = use.context.controllers.timeline.drag
	
	const [x, y] = dnd.grabbed && dnd.hovering
		? calculate_closest_track_place(dnd.grabbed, dnd.hovering.coordinates, 40)
		: [null, null]

	return html`
		<div
			style="
				width: ${dnd.grabbed ? calculate_track_clip_length(dnd.grabbed) : 0}px;
				transform: translate(${x}px, ${y}px);
			"
			class="drop-indicator">
		</div>
	`
})
