import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {V2} from "../../utils/coordinates_in_rect.js"
import {shadow_view} from "../../../../context/slate.js"
import {XClip} from "../../../../context/controllers/timeline/types.js"
import {calculate_track_clip_length} from "../../utils/calculate_track_clip_length.js"
import {calculate_clip_track_placement} from "../../utils/calculate_clip_track_placement.js"

export const Clip = shadow_view({styles}, use => (clip: XClip) => {
	const {drag, on_drop} = use.context.controllers.timeline
	const [[x, y], setCords] = use.state<V2 | [null, null]>([null, null])
	const {grabbed, hovering} = drag

	use.prepare(() => use.element.setAttribute("clip-id", clip.id))
	use.setup(() => on_drop(() => setCords([null, null])))

	const drag_events = {
		clip_drag_listener() {
			const clip_is_dragged = hovering?.coordinates && grabbed?.id === clip.id
			if(clip_is_dragged) {
				const center_of_clip: V2 = [
					hovering.coordinates[0] - calculate_track_clip_length(clip) / 2,
					hovering.coordinates[1] - 20
				]
				setCords(center_of_clip)
			}
		},
		start(event: DragEvent) {
			const img = new Image()
			img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
			event.dataTransfer?.setDragImage(img, 0, 0)
			drag.dragzone.dragstart(clip)(event)
		},
		drop(event: DragEvent) {
			if(hovering) {
				drag.dropzone.drop(hovering)(event)
			}
		}
	}

	drag_events.clip_drag_listener()

	return html`
		<span
			class="clip"
			?data-grabbed=${grabbed === clip}
			style="
				width: ${calculate_track_clip_length(clip)}px;
				transform: translate(${x ? x : clip.start_at_position}px, ${y ? y : calculate_clip_track_placement(clip.track, 40)}px);
			"
			draggable="true"
			@drop=${drag_events.drop}
			@dragstart=${drag_events.start}
		>
			${clip.item.type}
		</span>
	`
})
