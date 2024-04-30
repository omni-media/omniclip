import {GoldElement, html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {Filmstrips} from "../filmstrips/view.js"
import {V2} from "../../utils/coordinates_in_rect.js"
import {shadow_view} from "../../../../context/slate.js"
import {AnyEffect} from "../../../../context/controllers/timeline/types.js"
import {calculate_effect_width} from "../../utils/calculate_effect_width.js"
import {calculate_start_position} from "../../utils/calculate_start_position.js"
import {Waveform} from '../../../../context/controllers/timeline/parts/waveform.js'
import {calculate_effect_track_placement} from "../../utils/calculate_effect_track_placement.js"

export const Effect = shadow_view(use => ({id}: AnyEffect, timeline: GoldElement) => {
	use.styles(styles)
	use.watch(() => use.context.state.timeline)
	const effect = use.context.state.timeline.effects.find(effect => effect.id === id)!
	const {effect_drag, on_drop} = use.context.controllers.timeline
	const [[x, y], setCords] = use.state<V2 | [null, null]>([null, null])
	const zoom = use.context.state.timeline.zoom
	const {grabbed, hovering} = effect_drag
	const controller = use.context.controllers.timeline
	const handler = controller.effect_trim_handler

	use.mount(() => on_drop(() => setCords([null, null])))

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
		effect_trim_listener() {
			if(handler.effect_resize_handle_drag.hovering) {
				handler.effect_dragover(handler.effect_resize_handle_drag.hovering!.client_x, use.context.state.timeline)
				return
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

	use.mount(() => {
		window.addEventListener("drop", (e) => drag_events.drop(e))
		return () => removeEventListener("drop", drag_events.drop)
	})
	drag_events.effect_drag_listener()
	drag_events.effect_trim_listener()
	
	const text_effect_specific_styles = () => {
		if(effect.kind === "text") {
			return `
				${!controller.get_effects_on_track(use.context.state.timeline, effect.track)
					.some(effect => effect.kind !== "text")
					? `height: 30px;`
					: ""}
				background-color: ${effect.color};
			`
		} else return ""
	}

	const image_effect_specific_styles = () => {
		if(effect.kind === "image") {
			return `
				background-image: url(${effect.url});
				background-size: contain;
			`
		} else return ""
	}

	const render_trim_handle = (side: "left" | "right") => {
		return html`
			<span
				draggable="true"
				@drop=${(e: DragEvent) => handler.trim_drop(e, use.context.state.timeline)}
				@dragend=${(e: DragEvent) => handler.trim_end(e, use.context.state.timeline)}
				@dragstart=${(e: DragEvent) => handler.trim_start(e, effect, side)}
				class="trim-handle-${side}"
			>
				<span class=line></span>
				<span class=line></span>
			</span>
			`
	}

	const [wave, setWave] = use.state<null | HTMLDivElement>(null)

	use.mount(() => {
		let dispose: null | (() => boolean) = null
		let wave: Waveform | null = null
		if(effect.kind === "audio") {
			wave = new Waveform(effect, use.context.controllers.compositor, use.context.state.timeline)
			setWave(wave.wave)
			dispose = watch.track(() => use.context.state.timeline.zoom, (zoom) => {
				wave!.update_waveform(use.context.state.timeline)
			})
		}
		return () => {
			if(dispose) dispose()
			if(wave) {wave.dispose()}
		}
	})

	return html`
		<span
			class="effect"
			?data-grabbed=${grabbed?.effect === effect}
			?data-selected=${use.context.state.timeline.selected_effect?.id === effect.id}
			style="
				${image_effect_specific_styles()}
				${text_effect_specific_styles()}
				width: ${calculate_effect_width(effect, zoom)}px;
				transform: translate(${x ? x : calculate_start_position(effect.start_at_position, zoom)}px, ${y ? y : calculate_effect_track_placement(effect.track, use.context.state.timeline.effects)}px);
			"
			draggable="true"
			@dragstart=${drag_events.start}
			@click=${() => use.context.controllers.timeline.set_selected_effect(effect, use.context.controllers.compositor, use.context.state.timeline)}
		>
			${render_trim_handle("left")}
			${render_trim_handle("right")}
			${effect.kind === "video"
			? Filmstrips([effect, timeline])
			: effect.kind === "audio"
			? html`<span style="transform: translateX(${-effect.start * Math.pow(2, use.context.state.timeline.zoom)}px)">${wave}</span>`
			: null}
		</span>
	`
})
