import {coordinates_in_rect} from "@benev/construct"

import {Compositor} from "../controller.js"
import {TextEffect} from "../../timeline/types.js"
import {TimelineActions} from "../../timeline/actions.js"
import {is_point_inside_rectangle} from "../utils/is_point_inside_rectangle.js"

export class TextManager {

	#clicked_effect: TextEffect | null = null
	#on_rect_pointer_down = false
	#on_rotate_indicator_pointer_down = false

	constructor(private compositor: Compositor, private actions: TimelineActions) {
		window.addEventListener("pointerdown", (e) => {
			const rotate_indicator = e.composedPath().find((e) => (e as HTMLElement).className === "rotate")
			const rect = e.composedPath().find((e) => (e as HTMLElement).className === "text-rect")
			const omni_text_panel =	e.composedPath().find((e: any) => e.getAttribute ? e.getAttribute("view") === "text" : null)
			if(rotate_indicator) {this.#on_rotate_indicator_pointer_down = true}
				else {
					if(this.#clicked_effect && omni_text_panel)
						return
					this.#set_clicked_effect(e)
				}
			if(rect) {this.#on_rect_pointer_down = true}
		})
		window.addEventListener("pointerup", () => {
			this.#on_rotate_indicator_pointer_down = false
			this.#on_rect_pointer_down = false
		})
		window.addEventListener("pointermove", (e) => {
			if(this.#clicked_effect && this.#on_rotate_indicator_pointer_down) {
				this.#rotate_clicked_effect(e, this.#clicked_effect)
			}
			if(this.#on_rect_pointer_down && this.#clicked_effect) {
				this.#move_selected_effect(e, this.#clicked_effect)
			}
		})
	}

	#move_selected_effect(e: PointerEvent, effect: TextEffect) {
		const canvasRect = this.compositor.canvas.getBoundingClientRect()

		const scaleX = this.compositor.canvas.width / canvasRect.width
		const scaleY = this.compositor.canvas.height / canvasRect.height

		const coordinates = coordinates_in_rect([e.clientX, e.clientY], canvasRect)
		if(!coordinates)
			return
	
		const x = coordinates[0] * scaleX
		const y = coordinates[1] * scaleY

		this.actions.set_text_position_on_canvas(effect, x - effect.rect.width / 2, y + effect.rect.height / 2)
		const updated_effect: TextEffect = {...effect, rect: {
			...effect.rect,
			position_on_canvas: {
				x: x - effect.rect.width / 2,
				y: y + effect.rect.height / 2
			}
		}}
		this.#clicked_effect = updated_effect
		this.compositor.update_currently_played_effect(updated_effect)

		requestAnimationFrame(() => this.compositor.draw_effects(true))
	}

	#set_clicked_effect(e: PointerEvent) {
		const canvasRect = this.compositor.canvas.getBoundingClientRect()

		const scaleX = this.compositor.canvas.width / canvasRect.width
		const scaleY = this.compositor.canvas.height / canvasRect.height

		const clickedX = (e.clientX - canvasRect.left) * scaleX
		const clickedY = (e.clientY - canvasRect.top) * scaleY

		const clicked = this.#find_effect_at(clickedX, clickedY)
		this.actions.set_selected_effect(clicked)
		this.#clicked_effect = clicked
		if(!clicked)
			requestAnimationFrame(() => this.compositor.draw_effects(true))
	}
	
	#calculate_center_of_effect(effect: TextEffect) {
		return {
			centerX: effect.rect.position_on_canvas.x + effect.rect.width / 2,
			centerY: effect.rect.position_on_canvas.y - effect.rect.height / 2
		}
	}

	#rotate_clicked_effect(e: PointerEvent, effect: TextEffect) {
		const canvasRect = this.compositor.canvas.getBoundingClientRect()

		const scaleX = this.compositor.canvas.width / canvasRect.width
		const scaleY = this.compositor.canvas.height / canvasRect.height

		const adjustedX = (e.pageX - canvasRect.left) * scaleX
		const adjustedY = (e.pageY - canvasRect.top) * scaleY

		const {centerX, centerY} = this.#calculate_center_of_effect(effect)
		const dx = adjustedX - centerX
		const dy = adjustedY - centerY
		const result = Math.atan2(dy, dx)

		// this.rotate = Math.PI / 2 + result
		const rotate = Math.PI / 2 + result
		const updated_effect: TextEffect = {...effect, rect: {
			...effect.rect,
			rotation: rotate
		}}
		effect = updated_effect
		this.#clicked_effect = updated_effect
		this.compositor.update_currently_played_effect(updated_effect)
		this.actions.set_text_rotation(effect, rotate)
		requestAnimationFrame(() => this.compositor.draw_effects(true))
	}

	#find_effect_at(clickedX: number, clickedY: number) {
		for (const effect of this.compositor.currently_played_effects) {
			if(effect.kind === "text") {
				const is_inside = is_point_inside_rectangle(
					clickedX,
					clickedY,
					effect.rect.position_on_canvas.x,
					effect.rect.position_on_canvas.y - effect.rect.height,
					effect.rect.width,
					effect.rect.height,
					effect.rect.rotation!
				)
				if (is_inside) {return effect}
			}
		}
		return null
	}

	draw_text(source: TextEffect) {
		const {size, color, content} = source
		this.compositor.ctx!.fillStyle = color
		this.compositor.ctx!.font = `${size}px Lato`
		if(source.rect.rotation) {
			this.compositor.ctx!.save()
			this.#rotate_text(source)
			this.compositor.ctx!.fillText(content, -source.rect.width/2, source.rect.height/2)
			this.compositor.ctx!.restore()
		} else {
			this.compositor.ctx!.fillText(content, source.rect.position_on_canvas.x, source.rect.position_on_canvas.y)
		}
	}

	#rotate_text(effect: TextEffect) {
		const {centerX, centerY} = this.#calculate_center_of_effect(effect)
		this.compositor.ctx!.translate(centerX, centerY)
		// this.compositor.ctx!.rotate(Math.PI / 2);  // correction for image starting position
		this.compositor.ctx!.rotate(effect.rect.rotation)
	}

	measure_text_width (effect: TextEffect) {
		return this.compositor.ctx!.measureText(effect?.content).width!
	}

	measure_text_height(effect: TextEffect) {
		return this.compositor.ctx!.measureText(effect.content).actualBoundingBoxAscent! + this.compositor.ctx?.measureText(effect.content).actualBoundingBoxDescent!
	}
}
