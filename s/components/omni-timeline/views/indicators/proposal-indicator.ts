import {html} from "@benev/slate"
import {At, XClip} from "../../../../context/controllers/timeline/types.js"

import {V2} from "../../utils/coordinates_in_rect.js"
import {light_view} from "../../../../context/slate.js"
import {calculate_track_clip_length} from "../../utils/calculate_track_clip_length.js"
import {calculate_clip_track_placement} from "../../utils/calculate_clip_track_placement.js"

export const ProposalIndicator = light_view(use => () => {
	const {drag, on_drop} = use.context.controllers.timeline
	const {hovering, grabbed} = drag
	const [[start_position, track], setProposedPlace, getProposedPlace] = use.state<V2>([0, 0])

	use.setup(() => on_drop(({grabbed}) => {
		const [start_position, track] = getProposedPlace()
		use.context.actions.timeline_actions.set_clip_start_position(grabbed, start_position)
		use.context.actions.timeline_actions.set_clip_track(grabbed, track)
	}))

	const translate_to_timecode = (grabbed: XClip, hovering: At) => {
		const [x, y] = hovering.coordinates
		const timeline_start = x - calculate_track_clip_length(grabbed) / 2
		const timeline_end = x - calculate_track_clip_length(grabbed) / 2 + grabbed.length
		const track_index = Math.floor(y / 40)
		return {
			timeline_start,
			timeline_end,
			track_index
		}
	}

	if(hovering && grabbed) {
		const {timeline_start, timeline_end, track_index} = translate_to_timecode(grabbed, hovering)
		const {start_position, track} = use.context.controllers.timeline.calculate_proposed_clip_placement(timeline_start, timeline_end, track_index, grabbed!.id)
		setProposedPlace([start_position, track])
	}

	const shrinked_size = null
	return html`
		<div
			style="
				width: ${shrinked_size ? shrinked_size : drag.grabbed ? calculate_track_clip_length(drag.grabbed) : 0}px;
				transform: translate(${start_position}px, ${calculate_clip_track_placement(track, 40)}px);
			"
			data-indicator="drop-indicator"
			class="drop-indicator">
		</div>
	`
})
