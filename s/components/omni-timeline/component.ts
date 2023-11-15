import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {Clip} from "./views/clip/view.js"
import {Track} from "./views/track/view.js"
import {shadow_component} from "../../context/slate.js"
import {coordinates_in_rect, V2} from "./utils/coordinates_in_rect.js"
import {calculate_track_clip_length} from "./utils/calculate_track_clip_length.js"
import {calculate_closest_track_place} from "./utils/calculate_closest_track_place.js"

export const OmniTimeline = shadow_component({styles}, use => {
	use.watch(() => use.context.state.timeline)
	const state = use.context.state.timeline
	const dnd = use.context.controllers.timeline.drag

	const closest_track_place = dnd.grabbed && dnd.hovering
		? calculate_closest_track_place(dnd.grabbed, dnd.hovering.coordinates, 40)
		: null

	const augmented_dragover = (event: DragEvent) => {
		const {clientX, clientY} = event
		const target = event.currentTarget as HTMLElement
		const pointerCoordinates:V2 = [clientX, clientY]
		const elements_underneath_grabbed_clip = use.shadow.elementsFromPoint(clientX, clientY)
		const indicator = elements_underneath_grabbed_clip.find(e => e.className === "indicator-area")
		const coordinates = coordinates_in_rect(pointerCoordinates, target.getBoundingClientRect())

		dnd.dropzone.dragover({
			coordinates: coordinates!,
			indicator: indicator
		})(event)
	}

	const drop_indicator = () => {
		return html`
			<div
				style="
					width: ${dnd.grabbed ? calculate_track_clip_length(dnd.grabbed) : 0}px;
					transform: translate(${closest_track_place?.[0]}px, ${closest_track_place?.[1]}px);
				"
				class="drop-indicator">
			</div>
		`
	}

	const render_tracks = () => state.tracks.map((track) => Track(track))
	const render_clips = () => state.clips.map((clip) => Clip(clip))
	
	return html`
		<div
			@dragover=${augmented_dragover}
			class="timeline" style="width: ${state.length}px"
		>
			${render_tracks()}
			${render_clips()}
			${drop_indicator()}
		</div>
	`
})
