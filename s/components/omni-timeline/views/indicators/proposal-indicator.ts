import {html} from "@benev/slate"

import {V2} from "../../utils/coordinates_in_rect.js"
import {light_view} from "../../../../context/slate.js"
import {calculate_clip_width} from "../../utils/calculate_clip_width.js"
import {At, XClip} from "../../../../context/controllers/timeline/types.js"
import {calculate_start_position} from "../../utils/calculate_start_position.js"
import {calculate_clip_track_placement} from "../../utils/calculate_clip_track_placement.js"

export const ProposalIndicator = light_view(use => () => {
	const controller = use.context.controllers.timeline
	const actions = use.context.actions.timeline_actions
	const zoom = use.context.state.timeline.zoom
	const {drag: {hovering, grabbed}, on_drop} = controller
	const [[start_position, track], setProposedPlace, getProposedPlace] = use.state<V2>([0, 0])
	const [shrinkedSize, setShrinkedSize, getShrinkedSize] = use.state<null | number>(null)

	function translate_to_timecode(grabbed: XClip, hovering: At) {
		const baseline_zoom = use.context.state.timeline.zoom
		const [x, y] = hovering.coordinates
		const timeline_start = (x * Math.pow(2, -baseline_zoom)) - calculate_clip_width(grabbed, 0) / 2
		const timeline_end = (x * Math.pow(2, -baseline_zoom)) - calculate_clip_width(grabbed, 0) / 2 + grabbed.duration
		const track = Math.floor(y / 40)

		return {
			timeline_start,
			timeline_end,
			track
		}
	}

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
				width: ${shrinkedSize ? shrinkedSize * Math.pow(2, zoom) : grabbed ? calculate_clip_width(grabbed, zoom) : 0}px;
				transform: translate(${calculate_start_position(start_position, zoom)}px, ${calculate_clip_track_placement(track, 40)}px);
			"
			data-indicator="drop-indicator"
			class="drop-indicator">
		</div>
	`
})
