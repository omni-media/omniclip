import {html} from "@benev/slate"

import {V2} from "../../utils/coordinates_in_rect.js"
import {light_view} from "../../../../context/slate.js"
import {translate_to_timecode} from "../../utils/translate_to_timecode.js"
import {calculate_track_clip_length} from "../../utils/calculate_track_clip_length.js"
import {calculate_clip_track_placement} from "../../utils/calculate_clip_track_placement.js"

export const ProposalIndicator = light_view(use => () => {
	const controller = use.context.controllers.timeline
	const actions = use.context.actions.timeline_actions
	const {drag: {hovering, grabbed}, on_drop} = controller
	const [[start_position, track], setProposedPlace, getProposedPlace] = use.state<V2>([0, 0])
	const [shrinkedSize, setShrinkedSize, getShrinkedSize] = use.state<null | number>(null)

	use.setup(() => on_drop(({grabbed, dropped_at}) => {
		const [start_position, track] = getProposedPlace()
		const shrinkedSize = getShrinkedSize()
		controller.set_clip_timecode(grabbed, start_position, track)
		if(dropped_at.indicator === "add-track-indicator") {actions.add_track()}
		if(shrinkedSize) {actions.set_clip_duration(grabbed, shrinkedSize)}
	}))

	if(hovering && grabbed) {
		const timecode = translate_to_timecode(grabbed, hovering)
		const {start_position, track, shrinked_size} = use.context.controllers.timeline
		.calculate_proposed_clip_placement(
			timecode,
			grabbed!.id,
			use.context.state.timeline
		)
		setShrinkedSize(shrinked_size)
		setProposedPlace([start_position, track])
	}

	return html`
		<div
			style="
				display: ${grabbed ? "block" : "none"};
				width: ${shrinkedSize ? shrinkedSize : grabbed ? calculate_track_clip_length(grabbed) : 0}px;
				transform: translate(${start_position}px, ${calculate_clip_track_placement(track, 40)}px);
			"
			data-indicator="drop-indicator"
			class="drop-indicator">
		</div>
	`
})
