import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {Effect} from "./views/effect/view.js"
import {Track} from "./views/track/view.js"
import {Toolbar} from "./views/toolbar/view.js"
import {Playhead} from "./views/playhead/view.js"
import {TimeRuler} from "./views/time-ruler/view.js"
import {shadow_component} from "../../context/slate.js"
import {Indicator} from "../../context/controllers/timeline/types.js"
import {coordinates_in_rect, V2} from "./utils/coordinates_in_rect.js"
import {ProposalIndicator} from "./views/indicators/proposal-indicator.js"
import {calculate_timeline_width} from "./utils/calculate_timeline_width.js"

export const OmniTimeline = shadow_component({styles}, use => {
	use.watch(() => use.context.state.timeline)
	const state = use.context.state.timeline
	const video_export = use.context.controllers.video_export
	const dnd = use.context.controllers.timeline.drag
	const playhead_drag = use.context.controllers.timeline.playhead_drag
	const [coordinates, setCoordinates] = use.state<V2>([0, 0])

	const augmented_dragover = (event: DragEvent) => {
		const {clientX, clientY} = event
		const pointerCoordinates:V2 = [clientX, clientY]
		const indicator = (event.target as HTMLElement).part.value as Indicator
		const timeline = use.shadow.querySelector(".timeline-relative")
		const coordinates = coordinates_in_rect(pointerCoordinates, timeline!.getBoundingClientRect())
		dnd.dropzone.dragover({
			coordinates: coordinates!,
			indicator: indicator,
		})(event)
		playhead_drag.dropzone.dragover(coordinates!)(event)
		if(coordinates)
			setCoordinates(coordinates)
	}

	const render_tracks = () => state.tracks.map((_track) => Track([], {attrs: {part: "add-track-indicator"}}))
	const render_effects = () => state.effects.map((effect) => Effect([effect]))

	return html`
		<div
			@dragover=${augmented_dragover}
			class="timeline"
		>
			<button class="export-button" @click=${() => video_export.export_start(state)}>Export</button>
			${Toolbar([])}
			${TimeRuler([])}
			<div
				style="width: ${calculate_timeline_width(state.effects, state.zoom)}px"
				class=timeline-relative>
				${Playhead([coordinates])}
				${render_tracks()}
				${render_effects()}
				${ProposalIndicator()}
			</div>
		</div>
	`
})
