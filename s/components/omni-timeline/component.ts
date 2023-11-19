import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {Clip} from "./views/clip/view.js"
import {Track} from "./views/track/view.js"
import {shadow_component} from "../../context/slate.js"
import {Indicator} from "../../context/controllers/timeline/types.js"
import {coordinates_in_rect, V2} from "./utils/coordinates_in_rect.js"
import {ProposalIndicator} from "./views/indicators/proposal-indicator.js"

export const OmniTimeline = shadow_component({styles}, use => {
	use.watch(() => use.context.state.timeline)
	const state = use.context.state.timeline
	const dnd = use.context.controllers.timeline.drag

	const augmented_dragover = (event: DragEvent) => {
		
		const {clientX, clientY} = event
		const pointerCoordinates:V2 = [clientX, clientY]
		const indicator = (event.target as HTMLElement).part.value as Indicator
		const elements_underneath_hovered_clip = use.shadow.elementsFromPoint(clientX, clientY)
		const hovered_clip_element = elements_underneath_hovered_clip.find(e => e.getAttribute("clip-id") !== dnd.grabbed?.id)
		const clip_id = hovered_clip_element ? hovered_clip_element.getAttribute("clip-id") : null
		const coordinates = coordinates_in_rect(pointerCoordinates, use.element.getBoundingClientRect())
		const hovered_clip = state.clips.find(({id}) => id === clip_id)

		dnd.dropzone.dragover({
			coordinates: coordinates!,
			indicator: indicator,
			clip: hovered_clip
		})(event)
	}

	const render_tracks = () => state.tracks.map((_track) => Track([], {attrs: {part: "add-track-indicator"}}))
	const render_clips = () => state.clips.map((clip) => Clip([clip]))
	
	return html`
		<div
			@dragover=${augmented_dragover}
			class="timeline" style="width: ${state.length}px"
		>
			${render_tracks()}
			${render_clips()}
			${ProposalIndicator()}
		</div>
	`
})
