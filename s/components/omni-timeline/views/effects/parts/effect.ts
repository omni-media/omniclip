import {CSSResultGroup, TemplateResult, html, css, GoldElement} from "@benev/slate"

import {styles} from "./styles.js"
import {V2} from "../../../utils/coordinates_in_rect.js"
import {AnyEffect} from "../../../../../context/types.js"
import {shadow_view} from "../../../../../context/context.js"
import {calculate_effect_width} from "../../../utils/calculate_effect_width.js"
import {calculate_start_position} from "../../../utils/calculate_start_position.js"
import {calculate_effect_track_placement} from "../../../utils/calculate_effect_track_placement.js"

export const Effect = shadow_view(use => (timeline: GoldElement, any_effect: AnyEffect, content: TemplateResult, style?: CSSResultGroup, inline_css?: string) => {
	use.styles([style ?? css``, styles])
	use.watch(() => use.context.state)

	const effect = use.context.state.effects.find(effect => effect.id === any_effect.id)!
	const {effect_drag, on_drop} = use.context.controllers.timeline
	const [[x, y], setCords] = use.state<V2 | [null, null]>([null, null])
	const zoom = use.context.state.zoom
	const {grabbed, hovering} = effect_drag
	const controller = use.context.controllers.timeline
	const media_controller = use.context.controllers.media
	const handler = controller.effect_trim_handler
	const [fileNotFound, setFileNotFound] = use.state(false)
	const [timelineScrollLeft, setTimelineScrollLeft] = use.state(0)
	const [previewPosition, setPreviewPosition] = use.state<{start: null | number; startAtPosition: null | number; end: number | null}>({
		start: null,
		startAtPosition: null,
		end: null
	})

	use.mount(() => handler.onDrop(({effectId}) => {
		if(effectId === effect.id) {
			setPreviewPosition({
				startAtPosition: null,
				start: null,
				end: null
			})
		}
	}))

	use.mount(() => on_drop(({grabbed}) => {
		if(grabbed.effect.id === effect.id) {
			setPreviewPosition({
				startAtPosition: null,
				start: null,
				end: null
			})
			setCords([null, null])
		}
	}))

	use.mount(() => {
		const dispose = media_controller.on_media_change(({files, action}) => {
			if(action === "added") {
				for(const {hash} of files) {
					if(any_effect.kind !== "text" && hash === any_effect.file_hash)
						setFileNotFound(false)
				}
			}
		})
		const set_scroll = () => setTimelineScrollLeft(timeline.scrollLeft)
		timeline.addEventListener("scroll", set_scroll)
		return () => {removeEventListener("scroll", set_scroll); dispose()}
	})

	use.once(async () => {
		if(any_effect.kind !== "text") {
			const file = await media_controller.get_file(any_effect.file_hash)
			if(!file) {setFileNotFound(true)}
		}
	})

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
			} else {
				effect_drag.dragzone.dragend()(event)
			}
		},
		end(event: DragEvent) {
			effect_drag.dragzone.dragend()(event)
		}
	}

	use.mount(() => {
		const dispose = handler.onDragOver(({start_at_position, effectId, start, end}) => {
			if(effectId === effect.id) {
				setPreviewPosition({
					start,
					startAtPosition: start_at_position,
					end
				})
			}
		})
		window.addEventListener("dragend", drag_events.end)
		window.addEventListener("drop", drag_events.drop)
		return () => {removeEventListener("drop", drag_events.drop); removeEventListener("dragend", drag_events.end); dispose()}
	})

	drag_events.effect_drag_listener()
	
	const render_trim_handle = (side: "left" | "right") => {
		return html`
			<span
				draggable="true"
				@drop=${(e: DragEvent) => handler.trim_drop(e, use.context.state)}
				@dragend=${(e: DragEvent) => handler.trim_end(e, use.context.state)}
				@dragstart=${(e: DragEvent) => handler.trim_start(e, effect, side)}
				class="trim-handle-${side}"
			>
				<span class=line></span>
				<span class=line></span>
			</span>
			`
	}

	const renderPreview = () => {
		return html`
			<div
				?data-grabbed=${grabbed?.effect === effect}
				?data-selected=${use.context.state.selected_effect?.id === effect.id}
				style="
					${inline_css}
					width: ${((previewPosition.end ?? effect.end) - (previewPosition.start ?? effect.start)) * Math.pow(2, zoom)}px;
					height: 50px;
					transform: translate(
						${x ?? calculate_start_position(previewPosition.startAtPosition ?? effect.start_at_position, use.context.state.zoom)}px,
						${y ?? calculate_effect_track_placement(effect.track, use.context.state.effects)}px
					);
				"
				@dragstart=${drag_events.start}
				draggable="true"
				class="trim-handles"
			>
				${render_trim_handle("left")}
				${render_trim_handle("right")}
			</div>
		`
	}

	return html`
		${renderPreview()}
		<span
			class="effect"
			?data-no-file=${fileNotFound}
			?data-grabbed=${grabbed?.effect === effect}
			?data-selected=${use.context.state.selected_effect?.id === effect.id}
			style="
				${inline_css}
				width: ${calculate_effect_width(effect, zoom)}px;
				transform: translate(
					${x ?? calculate_start_position(effect.start_at_position, zoom)}px,
					${y ?? calculate_effect_track_placement(effect.track, use.context.state.effects)}px
				);
			"
			draggable="true"
			@dragstart=${drag_events.start}
			@click=${() => use.context.controllers.timeline.set_selected_effect(effect, use.context.controllers.compositor, use.context.state)}
		>
			${fileNotFound
				? html`<span style="width: 100%; transform: translateX(${timelineScrollLeft}px)">File Not Found: ${effect.kind !== "text" ? effect.name : null}</span>`
				: null
			}
			<span class="content" style="transform: translateX(${-effect.start * Math.pow(2, use.context.state.zoom)}px)">${content}</span>
		</span>
	`
})
