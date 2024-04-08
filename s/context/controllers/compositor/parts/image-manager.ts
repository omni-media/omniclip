import {Compositor} from "../controller.js"
import {ImageEffect} from "../../timeline/types.js"

export class ImageManager extends Map<string, {element: HTMLImageElement, file: File}> {

	constructor(private compositor: Compositor) {
		super()
	}

	async add_image(effect: ImageEffect, file: File) {
		let img = new Image()
		img.src = effect.url
		await new Promise(r => img.onload=r)
		this.set(effect.id, {element: img, file})
	}

	draw_image_frame(effect: ImageEffect) {
		if(effect.rect.rotation) {
			this.#draw_with_rotation(effect)
		} else {
			this.#draw_without_rotation(effect)
		}
	}

	#draw_with_rotation(effect: ImageEffect) {
		const {element} = this.get(effect.id)!
		const {rect} = effect
		this.compositor.ctx!.save()
		this.compositor.EffectManager.rotate_effect(effect)
		this.compositor.ctx!.drawImage(
			element,
			-rect.width / 2,
			-rect.height / 2,
			rect.width,
			rect.height
		)
		this.compositor.ctx!.restore()
	}

	#draw_without_rotation(effect: ImageEffect) {
		const {element} = this.get(effect.id)!
		const {rect} = effect
		this.compositor.ctx!.drawImage(
			element,
			rect.position_on_canvas.x,
			rect.position_on_canvas.y,
			rect.width,
			rect.height
		)
	}
}
