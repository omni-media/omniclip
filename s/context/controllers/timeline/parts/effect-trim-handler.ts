import {ShockDragDrop} from "@benev/construct"

import {TimelineActions} from "../actions.js"
import {AnyEffect, XTimeline} from "../types.js"

export class effectTrimHandler {
	effect_resize_handle_drag = new ShockDragDrop<"right" | "left", {x: number, client_x: number}>({handle_drop: (_event: DragEvent) => {}})
	initial_x = 0
	initial_start_position = 0
	initial_start = 0
	initial_end = 0
	side: "left" | "right" | null = null
	effect: AnyEffect | null = null
	dropped = false

	constructor(private actions: TimelineActions) {}

	effect_dragover(clientX: number, timeline: XTimeline) {
		if(!this.effect_resize_handle_drag.grabbed)
			return
		const get_effect = timeline.effects.find(({id}) => id === this.effect?.id)
		const delta = clientX - this.initial_x;
		if(this.effect_resize_handle_drag.grabbed === "left") {
			const is_within_boundary = delta < Math.abs(get_effect!.start_at_position - get_effect!.start)
			if (is_within_boundary) {
				const start_at = (this.initial_start_position + (delta  * Math.pow(2, -timeline.zoom))) < get_effect!.start_at_position - get_effect!.start
				? this.initial_start_position - this.initial_start
				: (this.initial_start_position + (delta  * Math.pow(2, -timeline.zoom)))
				const start = (this.initial_start + delta * Math.pow(2, -timeline.zoom)) < 0
				? 0
				: (this.initial_start + delta * Math.pow(2, -timeline.zoom))
				if(start_at >= get_effect!.start_at_position - get_effect!.start) {
					this.actions.set_effect_start_position(this.effect!, start_at)
					this.actions.set_effect_start(get_effect!, start)
				}
			}
		} else {
			const is_within_boundary = delta < get_effect!.duration - get_effect!.end
			if (is_within_boundary) {
				const end = (this.initial_end + delta * Math.pow(2, -timeline.zoom)) < this.effect!.duration
				? (this.initial_end + delta * Math.pow(2, -timeline.zoom))
				: this.effect!.duration
				this.actions.set_effect_end(get_effect!, end)
			}
		}
	}

	#normalize_to_timebase_and_set(e: DragEvent, timeline: XTimeline) {
		const get_effect = timeline.effects.find(({id}) => id === this.effect?.id)
		const frame_duration = 1000/timeline.timebase
		const delta = e.clientX - this.initial_x;
		if(this.effect_resize_handle_drag.grabbed === "left") {
			const start_at = Math.round((this.initial_start_position + (delta  * Math.pow(2, -timeline.zoom))) / frame_duration) * frame_duration
			const start = Math.round((this.initial_start + delta * Math.pow(2, -timeline.zoom)) / frame_duration) * frame_duration
			if(start_at >= get_effect!.start_at_position - get_effect!.start) {
				this.actions.set_effect_start(get_effect!, start)
				this.actions.set_effect_start_position(this.effect!, start_at)
			}
		} else {
			const is_within_boundary = delta < get_effect!.duration - get_effect!.end
			if (is_within_boundary) {
				const end = Math.round((this.initial_end + delta * Math.pow(2, -timeline.zoom)) / frame_duration) * frame_duration < this.effect!.duration 
					? Math.round((this.initial_end + delta * Math.pow(2, -timeline.zoom)) / frame_duration) * frame_duration
					: this.effect!.duration
				this.actions.set_effect_end(get_effect!, end)
			}
		}
	}

	trim_start = (e: DragEvent, effect: AnyEffect, side: "left" | "right") => {
		this.dropped = false
		this.initial_x = e.clientX
		this.initial_start_position = effect.start_at_position
		this.initial_start = effect.start
		this.initial_end = effect.end
		this.side = side
		this.effect = effect
		this.effect_resize_handle_drag.dragzone.dragstart(side)(e)
	}

	trim_end = (e: DragEvent, timeline: XTimeline) => {
		if(this.dropped === false) {
			this.#normalize_to_timebase_and_set(e, timeline)
			this.effect_resize_handle_drag.dragzone.dragend()(e)
		}
	}

	trim_drop = (e: DragEvent, timeline: XTimeline) => {
		this.dropped = true
		this.#normalize_to_timebase_and_set(e, timeline)
		this.effect_resize_handle_drag.dropzone.drop(this.effect_resize_handle_drag.hovering!)(e)
	}

}
