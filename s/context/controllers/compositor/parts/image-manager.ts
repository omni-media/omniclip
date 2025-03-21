import {generate_id} from "@benev/slate"

import {Compositor} from "../controller.js"
import {Actions} from "../../../actions.js"
import {ImageEffect, State} from "../../../types.js"
import {collaboration, omnislate} from "../../../context.js"
import {Image} from "../../../../components/omni-media/types.js"
import {find_place_for_new_effect} from "../../timeline/utils/find_place_for_new_effect.js"

export class ImageManager extends Map<string, {sprite: PIXI.Sprite, transformer: PIXI.Container}> {

	constructor(private compositor: Compositor, private actions: Actions) {super()}

	async create_and_add_image_effect(image: Image, state: State) {
		collaboration.broadcastMedia(image)
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
				position_on_canvas: {x: this.compositor.app.stage.width / 2, y: this.compositor.app.stage.height / 2},
				width: image.element.naturalWidth,
				height: image.element.naturalHeight,
				rotation: 0,
				scaleX: 1,
				scaleY: 1,
				pivot: {
					x: image.element.naturalWidth / 2,
					y: image.element.naturalHeight / 2
				}
			}
		}
		const {position, track} = find_place_for_new_effect(state.effects, state.tracks)
		effect.start_at_position = position!
		effect.track = track
		await this.add_image_effect(effect, image.file)
	}

	async add_image_effect(effect: ImageEffect, file: File, recreate?: boolean) {
		const url = URL.createObjectURL(file)
		const texture = await PIXI.Assets.load({src: url, format: file.type, loadParser: 'loadTextures'})
		const sprite = new PIXI.Sprite(texture)
		sprite.x = effect.rect.position_on_canvas.x
		sprite.y = effect.rect.position_on_canvas.y
		sprite.scale.set(effect.rect.scaleX, effect.rect.scaleY)
		sprite.rotation = effect.rect.rotation * (Math.PI / 180)
		sprite.pivot.set(effect.rect.pivot.x, effect.rect.pivot.y)
		sprite.eventMode = "static"
		sprite.cursor = "pointer"
		sprite.filters = []
		//@ts-ignore
		const transformer = new PIXI.Transformer({
			boxRotationEnabled: true,
			translateEnabled: false, // implemented my own translate which work with align guidelines
			group: [sprite],
			stage: this.compositor.app.stage,
			wireframeStyle: {
				thickness: 2,
				color: 0xff0000
			}
		})
		//@ts-ignore
		sprite.ignoreAlign = false
		transformer.ignoreAlign = true
		transformer.name = generate_id()
		sprite.on('pointerdown', (e) => {
			this.compositor.canvasElementDrag.onDragStart(e, sprite, transformer)
			this.compositor.app.stage.addChild(transformer)
		})
		;(sprite as any).effect = {...effect}
		this.set(effect.id, {transformer, sprite})
		if (recreate) {return}
		this.actions.add_image_effect(effect)
	}

	add_image_to_canvas(effect: ImageEffect) {
		const image = this.get(effect.id)
		if(image) {
			this.compositor.app.stage.addChild(image.sprite)
			image.sprite.zIndex = omnislate.context.state.tracks.length - effect.track
			image.transformer.zIndex = omnislate.context.state.tracks.length - effect.track
		}
	}

	remove_image_from_canvas(effect: ImageEffect) {
		const image = this.get(effect.id)
		if(image) {
			this.compositor.app.stage.removeChild(image.sprite)
			this.compositor.app.stage.removeChild(image.transformer)
		}
	}
}
