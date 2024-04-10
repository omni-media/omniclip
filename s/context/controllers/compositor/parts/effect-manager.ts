import {coordinates_in_rect} from "@benev/construct"

import {Compositor} from "../controller.js"
import {TimelineActions} from "../../timeline/actions.js"
import {is_point_inside_rectangle} from "../utils/is_point_inside_rectangle.js"
import {AnyEffect, ImageEffect, TextEffect, VideoEffect} from "../../timeline/types.js"

export class EffectManager {
	#clicked_effect: ImageEffect | VideoEffect | TextEffect | null = null
	#on_rect_pointer_down = false
	#on_rotate_indicator_pointer_down = false
	#offset_x = 0
	#offset_y = 0

	constructor(private compositor: Compositor, private actions: TimelineActions) {
		window.addEventListener("pointerdown", (e) => {
			const rotate_indicator = e.composedPath().find((e) => (e as HTMLElement).className === "rotate")
			const rect = e.composedPath().find((e) => (e as HTMLElement).className === "rect") as HTMLElement
			const omni_text_panel =	e.composedPath().find((e: any) => e.getAttribute ? e.getAttribute("view") === "text" : null)
			if(rotate_indicator) {this.#on_rotate_indicator_pointer_down = true}
				else {
					if(this.#clicked_effect && omni_text_panel)
						return
					this.#set_clicked_effect(e)
				}
			if(rect) {
				const [offset_x, offset_y] = coordinates_in_rect([e.clientX, e.clientY], rect!.getBoundingClientRect())!
				this.#offset_x = offset_x
				this.#offset_y = offset_y
				this.#on_rect_pointer_down = true
			}
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

	#move_selected_effect(e: PointerEvent, effect: ImageEffect | VideoEffect | TextEffect) {
		const canvasRect = this.compositor.canvas.getBoundingClientRect()

		const scaleX = this.compositor.canvas.width / canvasRect.width
		const scaleY = this.compositor.canvas.height / canvasRect.height

		const coordinates = coordinates_in_rect([e.clientX, e.clientY], canvasRect)
		if(!coordinates)
			return
		const x = (coordinates[0] - this.#offset_x) * scaleX
		const y = (coordinates[1] - this.#offset_y) * scaleY
		this.actions.set_position_on_canvas(effect, x, y)
		const updated_effect: ImageEffect | VideoEffect | TextEffect = {...effect, rect: {
			...effect.rect,
			position_on_canvas: {x, y}
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
		if(clicked) {
			this.#clicked_effect = {...clicked}
			this.actions.set_selected_effect(clicked)
		} else {
			requestAnimationFrame(() => this.compositor.draw_effects(true))
		}
	}
	
	calculate_center_of_effect(effect: ImageEffect | VideoEffect | TextEffect) {
		return {
			centerX: effect.rect.position_on_canvas.x + effect.rect.width / 2,
			centerY: effect.rect.position_on_canvas.y + effect.rect.height / 2
		}
	}

	#rotate_clicked_effect(e: PointerEvent, effect: ImageEffect | VideoEffect | TextEffect) {
		const canvasRect = this.compositor.canvas.getBoundingClientRect()

		const scaleX = this.compositor.canvas.width / canvasRect.width
		const scaleY = this.compositor.canvas.height / canvasRect.height

		const adjustedX = (e.pageX - canvasRect.left) * scaleX
		const adjustedY = (e.pageY - canvasRect.top) * scaleY

		const {centerX, centerY} = this.calculate_center_of_effect(effect)
		const dx = adjustedX - centerX
		const dy = adjustedY - centerY
		const result = Math.atan2(dy, dx)

		// this.rotate = Math.PI / 2 + result
		const rotate = Math.PI / 2 + result
		const updated_effect: ImageEffect | VideoEffect | TextEffect = {...effect, rect: {
			...effect.rect,
			rotation: rotate
		}}
		effect = updated_effect
		this.#clicked_effect = updated_effect
		this.compositor.update_currently_played_effect(updated_effect)
		this.actions.set_rotation(effect, rotate)
		requestAnimationFrame(() => this.compositor.draw_effects(true))
	}

	#sort_effects_by_track(effects: AnyEffect[]) {
		// so that effects on first track draw on top of things that are on second track
		const sorted_effects = effects.sort((a, b) => {
			if(a.track > b.track) return 1
				else return -1
		})
		return sorted_effects
	}

	#find_effect_at(clickedX: number, clickedY: number) {
		for (const effect of this.#sort_effects_by_track(this.compositor.currently_played_effects)) {
			if(effect.kind !== "audio") {
				const is_inside = is_point_inside_rectangle(
					clickedX,
					clickedY,
					effect.rect.position_on_canvas.x,
					effect.rect.position_on_canvas.y,
					effect.rect.width,
					effect.rect.height,
					effect.rect.rotation!
				)
				if (is_inside) {return effect}
			}
		}
		return null
	}

	rotate_effect(effect: ImageEffect | VideoEffect | TextEffect) {
		// console.log(effect.rect.rotation)
		const {centerX, centerY} = this.calculate_center_of_effect(effect)
		this.compositor.ctx!.translate(centerX, centerY)
		// ctx!.rotate(Math.PI / 2);  // correction for image starting position
		this.compositor.ctx!.rotate(effect.rect.rotation)
	}

	set_clicked_effect(effect: ImageEffect) {
		this.#clicked_effect = {...effect}
	}

}
