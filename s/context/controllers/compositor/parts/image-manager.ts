import {Compositor} from "../controller.js"
import {ImageEffect} from "../../timeline/types.js"

export class ImageManager extends Map<string, HTMLImageElement> {

	constructor(private compositor: Compositor) {
		super()
	}

	async add_image(effect: ImageEffect) {
		let img = new Image()
		img.src = effect.url
		await new Promise(r => img.onload=r)
		this.set(effect.id, img)
	}

	draw_image_frame(effect: ImageEffect) {
		const image = this.get(effect.id)!
		this.compositor.ctx!.drawImage(
			image,
			0,
			0,
			this.compositor.canvas.width,
			this.compositor.canvas.height
		)
	}
}
