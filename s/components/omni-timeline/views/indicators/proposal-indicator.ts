import {html} from "@benev/slate"

import {light_view} from "../../../../context/context.js"
import {ProposedTimecode} from "../../../../context/types.js"
import {calculate_effect_width} from "../../utils/calculate_effect_width.js"
import {calculate_start_position} from "../../utils/calculate_start_position.js"
import {calculate_effect_track_index} from "../../utils/calculate_effect_track_index.js"
import {calculate_effect_track_placement} from "../../utils/calculate_effect_track_placement.js"
import {getEffectsOnTrack} from "../../../../context/controllers/timeline/utils/get-effects-on-track.js"
import {EffectDrag, EffectDrop} from "../../../../context/controllers/timeline/parts/drag-related/effect-drag.js"

export const ProposalIndicator = light_view(use => () => {
	const controller = use.context.controllers.timeline
	const zoom = use.context.state.zoom
	const trim_handler = use.context.controllers.timeline.effectTrimHandler
	const effectDragHandler = controller.effectDragHandler
	const [_, setDraggedOverAddTrackIndicator, getDraggedOverAddTrackIndicator] = use.state(false)
	const [proposedTimecode, setProposedTimecode] = use.state<ProposedTimecode>({
		proposed_place: {track: 0, start_at_position: 0},
		duration: null,
		effects_to_push: null
	})
	const track_effects = getEffectsOnTrack(use.context.state, proposedTimecode.proposed_place.track)

	function translate_to_timecode({grabbed, position}: EffectDrop | EffectDrag) {
		const baseline_zoom = use.context.state.zoom
		const [x, y] = position.coordinates
		const start = ((x - grabbed.offset.x) * Math.pow(2, -baseline_zoom))
		const timeline_start = start >= 0 ? start : 0
		const timeline_end = ((x - grabbed.offset.x) * Math.pow(2, -baseline_zoom)) + (grabbed.effect.end - grabbed.effect.start)
		const track = calculate_effect_track_index(y, use.context.state.tracks.length, use.context.state.effects) > use.context.state.tracks.length - 1
			? use.context.state.tracks.length - 1
			: calculate_effect_track_index(y, use.context.state.tracks.length, use.context.state.effects)
		return {
			timeline_start,
			timeline_end,
			track
		}
	}

	use.mount(() => {
		const disposeDrop = effectDragHandler.onDrop(props => {
			const timecode = translate_to_timecode(props)
			const proposed_timecode = controller
			.calculate_proposed_timecode(
				timecode,
				props,
				use.context.state
			)
			controller.set_proposed_timecode(props, proposed_timecode, use.context.state)
			use.context.controllers.compositor.managers.transitionManager.removeTransitionFromNoLongerTouchingEffects(use.context.state)
		})

		const disposeDrag = effectDragHandler.onEffectDrag(props => {
			if(props.position && props.grabbed) {
				const timecode = translate_to_timecode(props)
				const proposed_timecode = use.context.controllers.timeline
				.calculate_proposed_timecode(
					timecode,
					props,
					use.context.state
				)
				setDraggedOverAddTrackIndicator(props.position.indicator?.type === "addTrack")
				setProposedTimecode(proposed_timecode)
			}
		})
		return () => {disposeDrag(); disposeDrop()}
	})

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
				display: ${effectDragHandler.grabbed && !trim_handler.grabbed && !getDraggedOverAddTrackIndicator() ? "block" : "none"};
				width: ${
					proposedTimecode.effects_to_push
					? 0
					: proposedTimecode.duration
					? proposedTimecode.duration * Math.pow(2, zoom)
					: effectDragHandler.grabbed
					? calculate_effect_width(effectDragHandler.grabbed.effect, zoom)
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
