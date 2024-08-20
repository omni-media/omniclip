import {pub} from "@benev/slate"
import {ShockDragDrop} from "@benev/construct"

import {Actions} from "../../../actions.js"
import {AnyEffect, State} from "../../../types.js"

export class effectTrimHandler {
	effect_resize_handle_drag = new ShockDragDrop<"right" | "left", {x: number, client_x: number}>({handle_drop: (_event: DragEvent) => {}})
	initial_x = 0
	initial_start_position = 0
	initial_start = 0
	initial_end = 0
	side: "left" | "right" | null = null
	effect: AnyEffect | null = null
	dropped = false

	#start_at = 0
	#start = 0
	#end = 0

	onDragOver = pub<{start_at_position: number, start: number, end: number, effectId: string}>()
	onDrop = pub<{effectId: string}>()

	constructor(private actions: Actions) {}

	effect_dragover(clientX: number, state: State) {
		if(!this.effect_resize_handle_drag.grabbed) {return}
		const effect = state.effects.find(({id}) => id === this.effect?.id)!
		const pointer_position = this.#get_pointer_position_relative_to_effect_right_or_left_side(clientX, state)
		if(this.effect_resize_handle_drag.grabbed === "left") {
			const start_at = this.initial_start_position + pointer_position
			const start = this.initial_start + pointer_position
			if(start <= effect!.end - 1000/state.timebase) {
				if(this.effect!.kind === "video" || this.effect!.kind === "audio") {
					if(start >= 1000/state.timebase) {
						this.#start_at = start_at
						this.#start = start
						this.onDragOver.publish({start_at_position: start_at, start, end: effect!.end, effectId: this.effect!.id})
					}
				} else {
					this.#start_at = start_at
					this.#start = start
					this.onDragOver.publish({start_at_position: start_at, start, end: effect!.end, effectId: this.effect!.id})
				}
			}
		} else {
			const end = this.initial_end + pointer_position
			if(end >= effect!.start + 1000/state.timebase) {
				if(this.effect!.kind === "video" || this.effect!.kind === "audio") {
					if(end <= this.effect!.duration) {
						this.#end = end
						this.onDragOver.publish({end, start_at_position: effect!.start_at_position, start: effect!.start, effectId: this.effect!.id})
					}
				} else {
					this.#end = end
					this.onDragOver.publish({end, start_at_position: effect!.start_at_position, start: effect!.start, effectId: this.effect!.id})
				}
			}
		}
	}

	#normalize_to_timebase_and_set(e: DragEvent, state: State) {
		const effect = state.effects.find(({id}) => id === this.effect?.id)!
		const frame_duration = 1000/state.timebase
		if(this.effect_resize_handle_drag.grabbed === "left") {
			const normalized_start = Math.round(this.#start / frame_duration) * frame_duration
			const normalized_start_at = Math.round(this.#start_at / frame_duration) * frame_duration
			this.actions.set_effect_start(this.effect!, normalized_start)
			this.actions.set_effect_start_position(this.effect!, normalized_start_at)
			this.onDrop.publish({effectId: effect.id})
		} else {
			const normalized_end = Math.round(this.#end / frame_duration) * frame_duration
			this.actions.set_effect_end(effect, normalized_end)
			this.onDrop.publish({effectId: effect.id})
		}
	}

	#get_pointer_position_relative_to_effect_right_or_left_side(clientX: number, state: State) {
		return (clientX - this.initial_x) * Math.pow(2, -state.zoom)
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

	trim_end = (e: DragEvent, state: State) => {
		if(this.dropped === false) {
			this.#normalize_to_timebase_and_set(e, state)
			this.effect_resize_handle_drag.dragzone.dragend()(e)
		}
	}

	trim_drop = (e: DragEvent, state: State) => {
		this.dropped = true
		this.#normalize_to_timebase_and_set(e, state)
		this.effect_resize_handle_drag.dropzone.drop(this.effect_resize_handle_drag.hovering!)(e)
	}

}
