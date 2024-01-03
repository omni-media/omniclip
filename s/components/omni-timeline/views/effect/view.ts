import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {V2} from "../../utils/coordinates_in_rect.js"
import {shadow_view} from "../../../../context/slate.js"
import {AnyEffect} from "../../../../context/controllers/timeline/types.js"
import {calculate_effect_width} from "../../utils/calculate_effect_width.js"
import {calculate_start_position} from "../../utils/calculate_start_position.js"
import {calculate_effect_track_placement} from "../../utils/calculate_effect_track_placement.js"

export const Effect = shadow_view({styles}, use => (effect: AnyEffect) => {
	const {drag, on_drop} = use.context.controllers.timeline
	const [[x, y], setCords] = use.state<V2 | [null, null]>([null, null])
	const zoom = use.context.state.timeline.zoom
	const {grabbed, hovering} = drag

	use.setup(() => on_drop(() => setCords([null, null])))

	const drag_events = {
		effect_drag_listener() {
			const effect_is_dragged = hovering?.coordinates && grabbed?.id === effect.id
			if(effect_is_dragged) {
				const center_of_effect: V2 = [
					hovering.coordinates[0] - calculate_effect_width(effect, zoom) / 2,
					hovering.coordinates[1] - 20
				]
				setCords(center_of_effect)
		}
		},
		start(event: DragEvent) {
			const img = new Image()
			img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
			event.dataTransfer?.setDragImage(img, 0, 0)
			drag.dragzone.dragstart(effect)(event)
		},
		drop(event: DragEvent) {
			if(hovering) {
				drag.dropzone.drop(hovering)(event)
			}
		}
	}

	drag_events.effect_drag_listener()

	return html`
		<span
			class="effect"
			?data-grabbed=${grabbed === effect}
			style="
				width: ${calculate_effect_width(effect, zoom)}px;
				transform: translate(${x ? x : calculate_start_position(effect.start_at_position, zoom)}px, ${y ? y : calculate_effect_track_placement(effect.track, 40)}px);
			"
			draggable="true"
			@drop=${drag_events.drop}
			@dragstart=${drag_events.start}
		>
			${effect.kind}
		</span>
	`
})
