import {html} from "@benev/slate"

import {light_view} from "../../../../context/context.js"
import {At, ProposedTimecode, Grabbed} from "../../../../context/types.js"
import {calculate_effect_width} from "../../utils/calculate_effect_width.js"
import {calculate_start_position} from "../../utils/calculate_start_position.js"
import {calculate_effect_track_index} from "../../utils/calculate_effect_track_index.js"
import {calculate_effect_track_placement} from "../../utils/calculate_effect_track_placement.js"

export const ProposalIndicator = light_view(use => () => {
	const controller = use.context.controllers.timeline
	const actions = use.context.actions
	const zoom = use.context.state.zoom
	const trim_handler = use.context.controllers.timeline.effect_trim_handler
	const {effect_drag: {hovering, grabbed}, on_drop} = controller
	const [proposedTimecode, setProposedTimecode, getProposedTimecode] = use.state<ProposedTimecode>({
		proposed_place: {track: 0, start_at_position: 0},
		duration: null,
		effects_to_push: null
	})

	const track_effects = controller.get_effects_on_track(use.context.state, proposedTimecode.proposed_place.track)

	function translate_to_timecode(grabbed: Grabbed, hovering: At) {
		const baseline_zoom = use.context.state.zoom
		const [x, y] = hovering.coordinates
		const start = ((x - grabbed.offset.x) * Math.pow(2, -baseline_zoom))
		const timeline_start = start >= 0 ? start : 0
		const timeline_end = ((x - grabbed.offset.x) * Math.pow(2, -baseline_zoom)) + (grabbed.effect.end - grabbed.effect.start)
		// limit to 4 tracks for now
		const track = calculate_effect_track_index(y, use.context.state.tracks.length, use.context.state.effects) > 3
			? 3
			: calculate_effect_track_index(y, use.context.state.tracks.length, use.context.state.effects)
		return {
			timeline_start,
			timeline_end,
			track
		}
	}

	use.mount(() => on_drop(({grabbed, dropped_at}) => {
		const proposed_timecode = getProposedTimecode()
		controller.set_proposed_timecode(grabbed.effect, proposed_timecode)
		if(dropped_at.indicator === "add-track-indicator") {actions.add_track()}
	}))

	if(hovering && grabbed) {
		const timecode = translate_to_timecode(grabbed, hovering)
		const proposed_timecode = use.context.controllers.timeline
		.calculate_proposed_timecode(
			timecode,
			grabbed!.effect.id,
			use.context.state
		)
		setProposedTimecode(proposed_timecode)
	}

	const text_effect_specific_styles = () => {
		return !track_effects.some(effect => effect.kind !== "text") && track_effects.find(effect => effect.kind === "text")
			? `height: 30px;`
			: ""
	}

	return html`
		<div
			?data-push-effects=${proposedTimecode?.effects_to_push}
			style="
				${text_effect_specific_styles()}
				display: ${grabbed && !trim_handler.effect_resize_handle_drag.grabbed ? "block" : "none"};
				width: ${
					proposedTimecode.effects_to_push
					? 0
					: proposedTimecode.duration
					? proposedTimecode.duration * Math.pow(2, zoom)
					: grabbed
					? calculate_effect_width(grabbed.effect, zoom)
					: 0
				}px;
				transform: translate(
					${calculate_start_position(proposedTimecode.proposed_place.start_at_position, zoom)}px,
					${calculate_effect_track_placement(proposedTimecode!.proposed_place.track, use.context.state.effects)}px
				);
			"
			data-indicator="drop-indicator"
			class="drop-indicator">
		</div>
	`
})
