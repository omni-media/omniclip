import {Compositor} from "../controller.js"
import {TimelineActions} from "../../timeline/actions.js"
import {AnyEffect, AudioEffect} from "../../timeline/types.js"

type Handle = "left" | "right" | "top" | "bottom"

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
			let newWidth = this.start_width
			let newHeight = this.start_height
			const scaleX = this.compositor.canvas.width / this.compositor.canvas.getBoundingClientRect().width
			const scaleY = this.compositor.canvas.height / this.compositor.canvas.getBoundingClientRect().height
			switch (this.selected_handle) {
				case "top":
					newHeight = this.start_height - (e.clientY - this.start_y) * scaleY
					const adjustedY = (e.clientY - this.compositor.canvas.getBoundingClientRect().top) * scaleY
					this.actions.set_position_on_canvas(this.effect!, this.effect!.rect.position_on_canvas.x, adjustedY)
					break
				case "right":
					newWidth = this.start_width + (e.clientX - this.start_x) * scaleX;
					break
				case "left":
					const adjustedX = (e.clientX - this.compositor.canvas.getBoundingClientRect().left) * scaleX
					newWidth = this.start_width - (e.clientX - this.start_x) * scaleX
					this.actions.set_position_on_canvas(this.effect!, adjustedX, this.effect!.rect.position_on_canvas.y)
					break
				case "bottom":
					newHeight = this.start_height + (e.clientY - this.start_y) * scaleY
					break
			}
			this.actions.set_effect_height(this.effect!, newHeight)
			this.actions.set_effect_width(this.effect!, newWidth)
		}
	}
}
