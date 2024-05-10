import {generate_id} from "@benev/slate"
import {FabricImage} from "fabric/dist/index.mjs"

import {Compositor} from "../controller.js"
import {Actions} from "../../../actions.js"
import {ImageEffect, State} from "../../../types.js"
import {Image} from "../../../../components/omni-media/types.js"
import {find_place_for_new_effect} from "../../timeline/utils/find_place_for_new_effect.js"

export class ImageManager extends Map<string, FabricImage> {

	constructor(private compositor: Compositor, private actions: Actions) {super()}

	async create_and_add_image_effect(image: Image, state: State) {
		const effect: ImageEffect = {
			id: generate_id(),
			kind: "image",
			file_hash: image.hash,
			duration: 1000,
			start_at_position: 0,
			start: 0,
			end: 1000,
			track: 2,
			name: image.file.name,
			rect: {
				position_on_canvas: {x: 100, y: 50},
				width: image.element.naturalWidth,
				height: image.element.naturalHeight,
				rotation: 0,
				scaleX: 1,
				scaleY: 1
			}
		}
		const {position, track} = find_place_for_new_effect(state.effects, state.tracks)
		effect.start_at_position = position!
		effect.track = track
		await this.add_image_effect(effect, image.file)
	}

	async add_image_effect(effect: ImageEffect, file: File, recreate?: boolean) {
		const url = URL.createObjectURL(file)
		const image = await FabricImage.fromURL(url, {}, {
			scaleX: effect.rect.scaleX,
			scaleY: effect.rect.scaleY,
			top: effect.rect.position_on_canvas.y,
			left: effect.rect.position_on_canvas.x,
			angle: effect.rect.rotation,
			objectCaching: false,
			effect: {...effect}
		})
		this.set(effect.id, image)
		if(recreate) {return}
		this.actions.add_image_effect(effect)
	}

	add_image_to_canvas(effect: ImageEffect) {
		const max_track = 4 // lower track means it should draw on top of higher tracks, although moveObjectTo z-index works in reverse
		const image = this.get(effect.id)
		if(image) {
			this.compositor.canvas.add(image)
			this.compositor.canvas.moveObjectTo(image, max_track - effect.track)
			this.compositor.canvas.renderAll()
		}
	}

	remove_image_from_canvas(effect: ImageEffect) {
		const image = this.get(effect.id)
		if(image) {
			this.compositor.canvas.remove(image)
			this.compositor.canvas.renderAll()
		}
	}
}
