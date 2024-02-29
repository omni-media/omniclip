import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {Effect} from "./views/effect/view.js"
import {Track} from "./views/track/view.js"
import {Toolbar} from "./views/toolbar/view.js"
import {Playhead} from "./views/playhead/view.js"
import {TimeRuler} from "./views/time-ruler/view.js"
import {shadow_component} from "../../context/slate.js"
import {Indicator} from "../../context/controllers/timeline/types.js"
import {ProposalIndicator} from "./views/indicators/proposal-indicator.js"
import {calculate_timeline_width} from "./utils/calculate_timeline_width.js"

export const OmniTimeline = shadow_component({styles}, use => {
	use.watch(() => use.context.state.timeline)
	const state = use.context.state.timeline
	const effect_drag = use.context.controllers.timeline.effect_drag
	const playhead_drag = use.context.controllers.timeline.playhead_drag
	const handler = use.context.controllers.timeline.effect_trim_handler

	use.setup(() => {
		window.addEventListener("dragover", augmented_dragover)
		return () => removeEventListener("dragover", augmented_dragover)
	})

	const playhead_drag_over = (event: DragEvent) => {
		const timeline = use.shadow.querySelector(".timeline-relative")
		const bounds = timeline?.getBoundingClientRect()
		const x = event.clientX - bounds!.left
		if(x >= 0) {
			playhead_drag.dropzone.dragover({x})(event)
		} else playhead_drag.dropzone.dragover({x: 0})(event)
	}

	const effect_drag_over = (event: DragEvent) => {
		const timeline = use.shadow.querySelector(".timeline-relative")
		const indicator = (event.target as HTMLElement).part.value as Indicator
		const bounds = timeline?.getBoundingClientRect()
		const x = event.clientX - bounds!.left
		const y = event.clientY - bounds!.top
		effect_drag.dropzone.dragover({
			coordinates: [x >= 0 ? x : 0, y >= 0 ? y : 0],
			indicator: indicator,
		})(event)
	}

	function augmented_dragover(event: DragEvent) {
		if(use.context.controllers.timeline.effect_trim_handler.effect_resize_handle_drag.grabbed) {
			handler.effect_dragover(event, use.element, use.context.state.timeline)
			return
		}
		playhead_drag_over(event)
		effect_drag_over(event)
	}

	const render_tracks = () => state.tracks.map((_track, i) => Track([i], {attrs: {part: "add-track-indicator"}}))
	const render_effects = () => use.context.state.timeline.effects.map((effect) => Effect([effect, use.element]))

	return html`
		<div
			class="timeline"
		>
			${Toolbar([])}
			${TimeRuler([use.element])}
			<div
				style="width: ${calculate_timeline_width(state.effects, state.zoom)}px"
				class=timeline-relative>
				${Playhead([])}
				${render_tracks()}
				${render_effects()}
				${ProposalIndicator()}
			</div>
		</div>
	`
})
