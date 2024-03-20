import WaveSurfer from 'wavesurfer.js'
import {GoldElement, html, watch} from "@benev/slate"
import {fetchFile} from "@ffmpeg/util/dist/esm/index.js"

import {styles} from "./styles.js"
import {Filmstrips} from "../filmstrips/view.js"
import {V2} from "../../utils/coordinates_in_rect.js"
import {shadow_view} from "../../../../context/slate.js"
import {calculate_effect_width} from "../../utils/calculate_effect_width.js"
import {calculate_start_position} from "../../utils/calculate_start_position.js"
import {calculate_effect_track_placement} from "../../utils/calculate_effect_track_placement.js"
import {AnyEffect, AudioEffect, TextEffect} from "../../../../context/controllers/timeline/types.js"

export const Effect = shadow_view(use => ({id, kind}: AnyEffect, timeline: GoldElement) => {
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

	const set_selected_effect = () => {
		use.context.actions.timeline_actions.set_selected_effect(effect)
		if(kind === "text")
			use.context.controllers.compositor.TextManager.set_clicked_effect(effect as TextEffect)
	}

	const wave = use.once(() => document.createElement("div"))

	use.once(async () => {
		if(effect.kind === "audio") {
			const wavesurfer = WaveSurfer.create({
				container: wave,
				backend: "MediaElement",
				autoScroll: true,
				hideScrollbar: true,
				interact: false,
				height: 50
			})

			wavesurfer.setOptions({width: calculate_effect_width(effect, use.context.state.timeline.zoom)})
			const uint = await fetchFile(effect.file)
			const blob = new Blob([uint])
			const url = URL.createObjectURL(blob)
			await wavesurfer.load(url)

			watch.track(() => use.context.state.timeline.zoom, (zoom) => {
				const get_effect = use.context.state.timeline.effects.find(e => e.id === effect.id)! as AudioEffect
				const width = get_effect.duration * Math.pow(2, use.context.state.timeline.zoom)
				if(width < 4000) {
					wavesurfer.setOptions({width})
				} else {
					wavesurfer.setOptions({width: 4000})
				}
				wavesurfer.zoom(width / wavesurfer.getDuration())
			})

			watch.track(() => use.context.state.timeline, (state) => {
				const get_effect = use.context.state.timeline.effects.find(e => e.id === effect.id)! as AudioEffect
				wave.style.transform = `translateX(${-get_effect.start * Math.pow(2, use.context.state.timeline.zoom)}px)`
			})
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
			@click=${set_selected_effect}
		>
			${render_trim_handle("left")}
			${render_trim_handle("right")}
			${effect.kind === "video"
			? Filmstrips([effect, timeline])
			: effect.kind === "audio"
			? wave
			: null}
		</span>
	`
})
