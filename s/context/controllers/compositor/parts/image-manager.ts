import {generate_id} from "@benev/slate"
import {FabricImage} from "fabric/dist/index.mjs"

import {Compositor} from "../controller.js"
import {TimelineActions} from "../../timeline/actions.js"
import {ImageEffect, XTimeline} from "../../timeline/types.js"
import {Image} from "../../../../components/omni-media/types.js"
import {find_place_for_new_effect} from "../../timeline/utils/find_place_for_new_effect.js"

export class ImageManager extends Map<string, {element: FabricImage, file: File}> {

	constructor(private compositor: Compositor, private actions: TimelineActions) {super()}

	async add_image_effect(image: Image, timeline: XTimeline) {
		const effect: ImageEffect = {
			id: generate_id(),
			kind: "image",
			duration: 1000,
			start_at_position: 0,
			start: 0,
			end: 1000,
			track: 2,
			url: image.url,
			rect: {
				position_on_canvas: {x: 100, y: 50},
				width: 500,
				height: 400,
				rotation: 0,
			}
		}
		const {position, track} = find_place_for_new_effect(timeline.effects, timeline.tracks)
		effect.start_at_position = position!
		effect.track = track
		await this.#add_image(effect, image.file)
		this.actions.add_image_effect(effect)
	}

	async #add_image(effect: ImageEffect, file: File) {
		let img = new Image()
		img.src = effect.url
		await new Promise(r => img.onload=r)
		const image = new FabricImage(img, {width: effect.rect.width, height: effect.rect.height, top: 0, left: 0, objectCaching: false, effect})
		this.set(effect.id, {element: image, file})
	}

	add_image_to_canvas(effect: ImageEffect) {
		const max_track = 4 // lower track means it should draw on top of higher tracks, although moveObjectTo z-index works in reverse
		const image = this.get(effect.id)!.element
		this.compositor.canvas.add(image)
		this.compositor.canvas.moveObjectTo(image, max_track - effect.track)
		this.compositor.canvas.renderAll()
	}

	remove_image_from_canvas(effect: ImageEffect) {
		const image = this.get(effect.id)!.element
		this.compositor.canvas.remove(image)
		this.compositor.canvas.renderAll()
	}
}
