import {Op, html, watch} from "@benev/slate"
import {repeat} from "lit/directives/repeat.js"

import {styles} from "./styles.js"
import {Track} from "./views/track/view.js"
import {Toolbar} from "./views/toolbar/view.js"
import {Indicator} from "../../context/types.js"
import {Playhead} from "./views/playhead/view.js"
import {TimeRuler} from "./views/time-ruler/view.js"
import {shadow_component} from "../../context/context.js"
import {TextEffect} from "./views/effects/text-effect.js"
import {VideoEffect} from "./views/effects/video-effect.js"
import {AudioEffect} from "./views/effects/audio-effect.js"
import {ImageEffect} from "./views/effects/image-effect.js"
import {StateHandler} from "../../views/state-handler/view.js"
import {ProposalIndicator} from "./views/indicators/proposal-indicator.js"
import {calculate_timeline_width} from "./utils/calculate_timeline_width.js"

export const OmniTimeline = shadow_component(use => {
	use.styles(styles)
	use.watch(() => use.context.state)
	const state = use.context.state
	const effect_drag = use.context.controllers.timeline.effect_drag
	const playhead_drag = use.context.controllers.timeline.playhead_drag
	const handler = use.context.controllers.timeline.effect_trim_handler

	use.mount(() => {
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
			handler.effect_dragover(event.clientX, use.context.state)
			return
		}
		playhead_drag_over(event)
		effect_drag_over(event)
	}

	const render_tracks = () => use.context.state.tracks.map((_track, i) => Track([i], {attrs: {part: "add-track-indicator"}}))
	const render_effects = () => repeat(use.context.state.effects, (effect) => effect.id, (effect) => {
		if(effect.kind === "audio") {
			return AudioEffect([effect, use.element])
		}
		else if (effect.kind === "video") {
			return VideoEffect([effect, use.element])
		}
		else if (effect.kind === "text") {
			return TextEffect([effect, use.element])
		}
		else if(effect.kind === "image") {
			return ImageEffect([effect, use.element])
		}
	})

	return StateHandler(Op.all(
		use.context.helpers.ffmpeg.is_loading.value,
		use.context.helpers.ffmpeg.is_loading.value), () => html`
		<div
			class="timeline"
		>
			${Toolbar([use.element])}
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
 `)
})
