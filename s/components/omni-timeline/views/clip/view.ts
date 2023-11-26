import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {V2} from "../../utils/coordinates_in_rect.js"
import {shadow_view} from "../../../../context/slate.js"
import {XClip} from "../../../../context/controllers/timeline/types.js"
import {calculate_clip_width} from "../../utils/calculate_clip_width.js"
import {calculate_start_position} from "../../utils/calculate_start_position.js"
import {calculate_clip_track_placement} from "../../utils/calculate_clip_track_placement.js"

export const Clip = shadow_view({styles}, use => (clip: XClip) => {
	const {drag, on_drop} = use.context.controllers.timeline
	const [[x, y], setCords] = use.state<V2 | [null, null]>([null, null])
	const zoom = use.context.state.timeline.zoom
	const {grabbed, hovering} = drag

	use.setup(() => on_drop(() => setCords([null, null])))

	const drag_events = {
		clip_drag_listener() {
			const clip_is_dragged = hovering?.coordinates && grabbed?.id === clip.id
			if(clip_is_dragged) {
				const center_of_clip: V2 = [
					hovering.coordinates[0] - calculate_clip_width(clip, zoom) / 2,
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
				width: ${calculate_clip_width(clip, zoom)}px;
				transform: translate(${x ? x : calculate_start_position(clip.start_at_position, zoom)}px, ${y ? y : calculate_clip_track_placement(clip.track, 40)}px);
			"
			draggable="true"
			@drop=${drag_events.drop}
			@dragstart=${drag_events.start}
		>
			${clip.item.type}
		</span>
	`
})
