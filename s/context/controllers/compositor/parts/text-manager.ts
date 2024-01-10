import {Compositor} from "../controller.js"
import {TextEffect} from "../../timeline/types.js"
import {TimelineActions} from "../../timeline/actions.js"
import {is_point_inside_rectangle} from "../utils/is_point_inside_rectangle.js"

export class TextManager {

	#centerX = 0
	#centerY = 0
	#clicked_effect: TextEffect | null = null
	rotate: null | number = null

	constructor(private compositor: Compositor, private actions: TimelineActions) {
		window.addEventListener("pointerdown", (e) => this.#set_clicked_effect(e))
		window.addEventListener("pointerup", () => this.#clicked_effect = null)
		window.addEventListener("pointermove", (e) => {
			if(this.#clicked_effect) {
				this.#rotate_clicked_effect(e, this.#clicked_effect)
			}
		})
	}

	#set_clicked_effect(e: PointerEvent) {
		const canvasRect = this.compositor.canvas.getBoundingClientRect()

		const scaleX = this.compositor.canvas.width / canvasRect.width
		const scaleY = this.compositor.canvas.height / canvasRect.height

		const clickedX = (e.clientX - canvasRect.left) * scaleX
		const clickedY = (e.clientY - canvasRect.top) * scaleY

		const clicked = this.#find_effect_at(clickedX, clickedY)
		this.actions.set_selected_effect(clicked)
		console.log(this.compositor.currently_played_effects, "effects played")
		this.#clicked_effect = clicked
		if(!clicked)
			this.compositor.draw_effects(true)
	}

	#rotate_clicked_effect(e: PointerEvent, effect: TextEffect) {
		const canvasRect = this.compositor.canvas.getBoundingClientRect()

		this.#centerX = effect.rect.position_on_canvas.x + effect.rect.width / 2
		this.#centerY = effect.rect.position_on_canvas.y - effect.rect.height / 2

		const scaleX = this.compositor.canvas.width / canvasRect.width
		const scaleY = this.compositor.canvas.height / canvasRect.height

		const adjustedX = (e.pageX - canvasRect.left) * scaleX
		const adjustedY = (e.pageY - canvasRect.top) * scaleY

		const dx = adjustedX - this.#centerX
		const dy = adjustedY - this.#centerY
		const result = Math.atan2(dy, dx)

		this.rotate = result
		this.compositor.draw_effects(true)
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
					this.rotate!
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
		if(this.rotate) {
			this.compositor.ctx!.save()
			this.#rotate_text(source)
			this.compositor.ctx!.fillText(content, -source.rect.width/2, source.rect.height/2)
			this.compositor.ctx!.restore()
		} else {
			this.compositor.ctx!.fillText(content, source.rect.position_on_canvas.x, source.rect.position_on_canvas.y)
		}
	}

	#rotate_text(effect: TextEffect) {
		this.compositor.ctx!.translate(this.#centerX, this.#centerY)
		 //this.ctx!.rotate(-Math.PI / 2);  // correction for image starting position
		this.actions.set_text_rotation(effect, this.rotate!)
		this.compositor.ctx!.rotate(this.rotate!)
	}

	measure_text_width (effect: TextEffect) {
		return this.compositor.ctx!.measureText(effect?.content).width!
	}

	measure_text_height(effect: TextEffect) {
		return this.compositor.ctx!.measureText(effect.content).actualBoundingBoxAscent! + this.compositor.ctx?.measureText(effect.content).actualBoundingBoxDescent!
	}
}
