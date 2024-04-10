import {Compositor} from "../controller.js"
import {TimelineActions} from "../../timeline/actions.js"
import {AnyEffect, AudioEffect} from "../../timeline/types.js"

type Handle = "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-right" | "bottom-left"

export class EffectResizer {
	selected_handle: Handle | null = null
	start_x = 0
	start_y = 0
	start_width = 0
	start_height = 0
	effect: Exclude<AnyEffect, AudioEffect> | null = null

	constructor(private compositor: Compositor, private actions: TimelineActions) {}

	set_handle(e: MouseEvent | PointerEvent, handle: Handle | null, effect: Exclude<AnyEffect, AudioEffect> | null) {
		this.selected_handle = handle
		this.start_x = e.clientX;
		this.start_y = e.clientY;
		this.start_width = effect?.rect.width ?? 0;
		this.start_height = effect?.rect.height ?? 0;
		this.effect = effect
	}

	resize_effect = (e: PointerEvent) => {
		if (this.selected_handle) {
			let new_width = this.start_width
			let new_height = this.start_height
			const scale_x = this.compositor.canvas.width / this.compositor.canvas.getBoundingClientRect().width
			const scale_y = this.compositor.canvas.height / this.compositor.canvas.getBoundingClientRect().height
			const adjusted_y = (e.clientY - this.compositor.canvas.getBoundingClientRect().top) * scale_y
			const adjusted_x = (e.clientX - this.compositor.canvas.getBoundingClientRect().left) * scale_x
			switch (this.selected_handle) {
				case "top":
					new_height = this.start_height - (e.clientY - this.start_y) * scale_y
					this.actions.set_position_on_canvas(this.effect!, this.effect!.rect.position_on_canvas.x, adjusted_y)
					break
				case "right":
					new_width = this.start_width + (e.clientX - this.start_x) * scale_x
					break
				case "left":
					new_width = this.start_width - (e.clientX - this.start_x) * scale_x
					this.actions.set_position_on_canvas(this.effect!, adjusted_x, this.effect!.rect.position_on_canvas.y)
					break
				case "bottom":
					new_height = this.start_height + (e.clientY - this.start_y) * scale_y
					break
				case "bottom-right":
					new_height = this.start_height + (e.clientY - this.start_y) * scale_y
					new_width = this.start_width + (e.clientX - this.start_x) * scale_x
					break
				case "top-right":
					new_height = this.start_height - (e.clientY - this.start_y) * scale_y
					new_width = this.start_width + (e.clientX - this.start_x) * scale_x
					this.actions.set_position_on_canvas(this.effect!, this.effect!.rect.position_on_canvas.x, adjusted_y)
					break
				case "top-left":
					new_height = this.start_height - (e.clientY - this.start_y) * scale_y
					new_width = this.start_width - (e.clientX - this.start_x) * scale_x
					this.actions.set_position_on_canvas(this.effect!, adjusted_x, adjusted_y)
					break
				case "bottom-left":
					new_height = this.start_height + (e.clientY - this.start_y) * scale_y
					new_width = this.start_width - (e.clientX - this.start_x) * scale_x
					this.actions.set_position_on_canvas(this.effect!, adjusted_x, this.effect!.rect.position_on_canvas.y)
					break
			}
			this.actions.set_effect_height(this.effect!, new_height)
			this.actions.set_effect_width(this.effect!, new_width)
		}
	}
}
