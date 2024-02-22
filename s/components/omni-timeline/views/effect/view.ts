import {GoldElement, html} from "@benev/slate"

import {styles} from "./styles.js"
import {Filmstrips} from "../filmstrips/view.js"
import {V2} from "../../utils/coordinates_in_rect.js"
import {shadow_view} from "../../../../context/slate.js"
import {AnyEffect} from "../../../../context/controllers/timeline/types.js"
import {calculate_effect_width} from "../../utils/calculate_effect_width.js"
import {calculate_start_position} from "../../utils/calculate_start_position.js"
import {calculate_effect_track_placement} from "../../utils/calculate_effect_track_placement.js"

export const Effect = shadow_view({styles}, use => (effect: AnyEffect, timeline: GoldElement) => {
	use.watch(() => use.context.state.timeline)
	const {effect_drag, on_drop} = use.context.controllers.timeline
	const [[x, y], setCords] = use.state<V2 | [null, null]>([null, null])
	const zoom = use.context.state.timeline.zoom
	const {grabbed, hovering} = effect_drag
	const controller = use.context.controllers.timeline
	use.setup(() => on_drop(() => setCords([null, null])))

	const drag_events = {
		effect_drag_listener() {
			const effect_is_dragged = hovering?.coordinates && grabbed?.effect.id === effect.id
			if(effect_is_dragged) {
				const center_of_effect: V2 = [
					hovering.coordinates[0] - grabbed.offset.x,
					hovering.coordinates[1] - grabbed.offset.y
				]
				setCords(center_of_effect)
		}
		},
		start(event: DragEvent) {
			const img = new Image()
			img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
			event.dataTransfer?.setDragImage(img, 0, 0)
			effect_drag.dragzone.dragstart({effect, offset: {x: event.offsetX, y: event.offsetY}})(event)
		},
		drop(event: DragEvent) {
			const hovering = use.context.controllers.timeline.effect_drag.hovering
			if(hovering) {
				effect_drag.dropzone.drop(hovering)(event)
			}
		}
	}

	use.setup(() => {
		window.addEventListener("drop", (e) => drag_events.drop(e))
		return () => removeEventListener("drop", drag_events.drop)
	})
	drag_events.effect_drag_listener()
	
	const text_effect_specific_styles = () => {
		if(effect.kind === "text") {
			return `
				${!controller.get_effects_on_track(use.context.state.timeline, effect.track)
					.find(effect => effect.kind === "video")
					? `height: 30px;`
					: ""}
				background-color: ${effect.color};
			`
		} else return ""
	}

	return html`
		<span
			class="effect"
			?data-grabbed=${grabbed?.effect === effect}
			?data-selected=${use.context.state.timeline.selected_effect?.id === effect.id}
			style="
				${text_effect_specific_styles()}
				width: ${calculate_effect_width(effect, zoom)}px;
				transform: translate(${x ? x : calculate_start_position(effect.start_at_position, zoom)}px, ${y ? y : calculate_effect_track_placement(effect.track, use.context.state.timeline.effects)}px);
			"
			draggable="true"
			@dragstart=${drag_events.start}
			@click=${() => use.context.actions.timeline_actions.set_selected_effect(effect)}
		>
			${effect.kind === "video"
			? Filmstrips([effect, timeline])
			: null}
		</span>
	`
})
