import {pub, reactor, signal} from "@benev/slate"

import {Actions} from "../../actions.js"
import {omnislate} from "../../context.js"
import {Media} from "../media/controller.js"
import {TextManager} from "./parts/text-manager.js"
import {ImageManager} from "./parts/image-manager.js"
import {AudioManager} from "./parts/audio-manager.js"
import {VideoManager} from "./parts/video-manager.js"
import {FiltersManager} from "./parts/filter-manager.js"
import {AlignGuidelines} from "./lib/aligning_guidelines.js"
import {AnimationManager} from "./parts/animation-manager.js"
import {compare_arrays} from "../../../utils/compare_arrays.js"
import {TransitionManager} from "./parts/transition-manager.js"
import {get_effect_at_timestamp} from "../video-export/utils/get_effect_at_timestamp.js"
import {AnyEffect, AudioEffect, ImageEffect, State, TextEffect, VideoEffect} from "../../types.js"

export interface Managers {
	videoManager: VideoManager
	textManager: TextManager
	imageManager: ImageManager
	audioManager: AudioManager
	animationManager: AnimationManager
	filtersManager: FiltersManager
	transitionManager: TransitionManager
}

export class Compositor {
	on_playing = pub()
	#is_playing = signal(false)
	#last_time = 0
	#pause_time = 0
	timecode = 0
	timebase = 25
	currently_played_effects = new Map<string, AnyEffect>()

	app = new PIXI.Application({width: 1920, height: 1080, backgroundColor: "black", preference: "webgl"})
	#seekedResolve: ((value: unknown) => void) | null = null
	#recreated = false
	
	managers: Managers
	guidelines: AlignGuidelines
	#guidelineRect: PIXI.Sprite

	#pointerDown = false

	constructor(private actions: Actions) {
		this.#on_selected_canvas_object()
		this.app.stage.sortableChildren = true
		this.app.stage.interactive = true
		const {guidelines, guidelintRect} = this.init_guidelines()
		this.guidelines = guidelines
		this.#guidelineRect = guidelintRect
		this.app.stage.hitArea = this.app.screen
		this.app.stage.on('pointerup', () => this.canvasElementDrag.onDragEnd())
		this.app.stage.on('pointerupoutside', this.canvasElementDrag.onDragEnd)

		this.managers = {
			videoManager: new VideoManager(this, actions),
			textManager: new TextManager(this, actions),
			imageManager: new ImageManager(this, actions),
			audioManager: new AudioManager(this, actions),
			animationManager: new AnimationManager(this, actions, "Animation"),
			filtersManager: new FiltersManager(this, actions),
			transitionManager: new TransitionManager(this, actions)
		}

		this.#on_playing()
		reactor.reaction(
			() => this.#is_playing.value,
			(is_playing) => {
				if(is_playing) {
					this.managers.transitionManager.play(this.timecode)
					this.managers.animationManager.play(this.timecode)
					this.managers.videoManager.play_videos()
					this.managers.audioManager.play_audios()
				} else {
					this.managers.transitionManager.pause()
					this.managers.animationManager.pause()
					this.managers.videoManager.pause_videos()
					this.managers.audioManager.pause_audios()
				}
			}
		)
	}

	#on_playing = () => {
		if(!this.#is_playing.value) {
			this.#pause_time = performance.now() - this.#last_time
		}
		if(this.#is_playing.value) {
			const elapsed_time = this.#calculate_elapsed_time()
			this.actions.increase_timecode(elapsed_time, {omit: true})
			this.on_playing.publish(0)
			this.compose_effects([...this.currently_played_effects.values()], this.timecode)
		}
		requestAnimationFrame(this.#on_playing)
	}

	canvasElementDrag = {
		onDragStart: (e: PIXI.FederatedPointerEvent, sprite: PIXI.Container, transformer: PIXI.Container) => {
			if(this.selectedElement) {this.app.stage.removeChild(this.selectedElement?.transformer)}
			this.#pointerDown = true
			let position = e.getLocalPosition(sprite)
			sprite.pivot.set(position.x, position.y)
			sprite.position.set(e.global.x, e.global.y)
			this.app.stage.on('pointermove', (e) => this.canvasElementDrag.onDragMove(e))
		},
		onDragEnd: () => {
			if (this.selectedElement) {
				this.app.stage.off('pointermove', this.canvasElementDrag.onDragMove)
				this.#pointerDown = false
			}
		},
		onDragMove: (event: PIXI.FederatedPointerEvent) => {
			if (this.selectedElement && this.#pointerDown) {
				this.selectedElement?.sprite.parent.toLocal(event.global, undefined, this.selectedElement.sprite.position)
				if(this.guidelines) {
					this.guidelines.on_object_move_or_scale(event)
				}
			}
		}
	}

	reset() {
		omnislate.context.state.effects.forEach(effect => {
			if(effect.kind === "text") {
				this.managers.textManager.remove_text_from_canvas(effect)
			} else if(effect.kind === "video") {
				this.managers.videoManager.remove_video_from_canvas(effect)
			} else if(effect.kind === "image") {
				this.managers.imageManager.remove_image_from_canvas(effect)
			}
		})
		this.currently_played_effects.clear()
		this.app.renderer.clear()
	}

	clear(omit?: boolean) {
		this.app.renderer.clear()
		this.app.stage.removeChildren()
		const {guidelines, guidelintRect} = this.init_guidelines()
		this.guidelines = guidelines
		this.#guidelineRect = guidelintRect
		this.managers.animationManager.clearAnimations(omit)
		this.managers.transitionManager.clearTransitions(omit)
		this.actions.set_selected_effect(null)
	}
	
	#calculate_elapsed_time() {
		const now = performance.now() - this.#pause_time
		const elapsed_time = now - this.#last_time
		this.#last_time = now
		return elapsed_time
	}

	compose_effects(effects: AnyEffect[], timecode: number, exporting?: boolean) {
		if(!this.#recreated) {return}
		this.timecode = timecode
		this.#update_currently_played_effects(effects, timecode, exporting)
		this.app.render()
	}

	get_effect_current_time_relative_to_timecode(effect: AnyEffect, timecode: number) {
		const current_time = timecode - effect.start_at_position + effect.start
		return current_time / 1000
	}

	get_effects_relative_to_timecode(effects: AnyEffect[], timecode: number) {
		return effects.filter(effect => {
			const transition = this.managers.transitionManager.getTransitionByEffect(effect)
			const {incoming, outgoing} = this.managers.transitionManager.getTransitionDurationPerEffect(transition, effect)
			return effect.start_at_position - incoming <= timecode && timecode <= effect.start_at_position + (effect.end - effect.start) + outgoing
		})
	}

	#update_currently_played_effects(effects: AnyEffect[], timecode: number, exporting?: boolean) {
		const effects_relative_to_timecode = this.get_effects_relative_to_timecode(effects, timecode)
		const {add, remove} = compare_arrays([...this.currently_played_effects.values()], effects_relative_to_timecode)
		this.#update_effects(effects_relative_to_timecode)
		this.#remove_effects_from_canvas(remove, exporting)
		this.#add_effects_to_canvas(add)
		this.#setEffectsIndexes(effects)
		this.app.stage.sortChildren()
	}

	#setEffectsIndexes(effects: AnyEffect[]) {
		effects.filter(e => e.kind !== "audio").forEach(e => {
			const effect = e as ImageEffect | VideoEffect | TextEffect
			const object = this.getObject(effect)
			if(object) {
				object.sprite.zIndex = omnislate.context.state.tracks.length - effect.track
				object.transformer.zIndex = omnislate.context.state.tracks.length - effect.track
			}
		})
	}

	#update_effects(new_effects: AnyEffect[]) {
		this.currently_played_effects.clear()
		new_effects.forEach(effect => {this.currently_played_effects.set(effect.id, effect)})
	}

	async seek(timecode: number, redraw?: boolean) {
		this.managers.animationManager.seek(timecode)
		this.managers.transitionManager.seek(timecode)
		for(const effect of this.currently_played_effects.values()) {
			if(effect.kind === "audio") {
				const audio = this.managers.audioManager.get(effect.id)
				if(!redraw && audio?.paused && this.#is_playing.value) {await audio.play()}
				if(redraw && timecode && audio) {
					const current_time = this.get_effect_current_time_relative_to_timecode(effect, timecode)
					audio.currentTime = current_time
					await this.#onSeeked(audio)
				}
			}
			if(effect.kind === "video") {
				const video = this.managers.videoManager.get(effect.id)?.sprite
				const element = video?.texture.baseTexture.resource.source as HTMLVideoElement | null
				if(!redraw && element?.paused && this.#is_playing.value) {await element.play()}
				if(redraw && timecode && element) {
					const current_time = this.get_effect_current_time_relative_to_timecode(effect, timecode)
					element.currentTime = current_time
					await this.#onSeeked(element)
				}
			}
		}
	}

	#onSeeked(element: HTMLVideoElement | HTMLAudioElement) {
		const onSeekedEvent = () => {
			if(this.#seekedResolve) {
				element.removeEventListener("seeked", onSeekedEvent)
				this.#seekedResolve(true)
				this.#seekedResolve = null
			}
		}
		onSeekedEvent()
		return new Promise((resolve) => {
			this.#seekedResolve = resolve
			element.addEventListener("seeked", onSeekedEvent, { once: true })
		})
	}

	#add_effects_to_canvas(effects: AnyEffect[]) {
		for(const effect of effects) {
			if(effect.kind === "image") {
				this.currently_played_effects.set(effect.id, effect)
				this.managers.imageManager.add_image_to_canvas(effect)
			}
			else if(effect.kind === "video") {
				this.currently_played_effects.set(effect.id, effect)
				this.managers.videoManager.add_video_to_canvas(effect)
				const element = this.managers.videoManager.get(effect.id)?.sprite?.texture.baseTexture.resource.source as HTMLVideoElement
				if(element) {element.currentTime = effect.start / 1000}
			}
			else if(effect.kind === "text") {
				this.currently_played_effects.set(effect.id, effect)
				this.managers.textManager.add_text_to_canvas(effect)
			}
			else if(effect.kind === "audio") {
				this.currently_played_effects.set(effect.id, effect)
				const element = this.managers.audioManager.get(effect.id)
				if(element) {element.currentTime = effect.start / 1000}
			}
		}
		this.update_canvas_objects(omnislate.context.state)
	}

	#remove_effects_from_canvas(effects: AnyEffect[], exporting?: boolean) {
		for(const effect of effects) {
			if(effect.kind === "image") {
				this.currently_played_effects.delete(effect.id)
				this.managers.imageManager.remove_image_from_canvas(effect)
			}
			else if(effect.kind === "text") {
				this.currently_played_effects.delete(effect.id)
				this.managers.textManager.remove_text_from_canvas(effect)
			}
			else if(effect.kind === "video") {
				this.currently_played_effects.delete(effect.id)
				this.managers.videoManager.remove_video_from_canvas(effect)
				if(!exporting) {
					this.managers.videoManager.pause_video(effect)
				}
			}
			else if(effect.kind === "audio") {
				this.currently_played_effects.delete(effect.id)
				if(!exporting) {
					this.managers.audioManager.pause_audio(effect)
				}
			}
		}
	}

	getObject(effect: VideoEffect | ImageEffect | TextEffect) {
		const videoObject = this.managers.videoManager.get(effect.id)
		const imageObject = this.managers.imageManager.get(effect.id)
		const textObject = this.managers.textManager.get(effect.id)
		if (videoObject) {
			return videoObject
		} else if (imageObject) {
			return imageObject
		} else if (textObject) {
			return textObject
		}
	}

	init_guidelines() {
		const guidelines = new AlignGuidelines({
			app: this.app,
			compositor: this,
			ignoreObjTypes: [{key: "ignoreAlign", value: true}],
			pickObjTypes: [{key: "ignoreAlign", value: false}]
		})
		// add rect as big as canvas so it acts as guideline for canvas borders
		guidelines.init()
		const guidelintRect = new PIXI.Sprite()
		guidelintRect.width = this.app.view.width
		guidelintRect.height = this.app.view.height
		guidelintRect.eventMode = "none"
		this.app.stage.addChild(guidelintRect)
		return {guidelintRect, guidelines}
	}

	#on_selected_canvas_object() {
		this.app.stage.on("pointerdown", (e) => {
			//@ts-ignore
			const selected_effect = e.target ? e.target.effect as AnyEffect : undefined
			const effect = omnislate.context.state.effects.find(e => e.id === selected_effect?.id)
			omnislate.context.controllers.timeline.set_selected_effect(effect, omnislate.context.state)
		})
		this.app.stage.on("pointerup", (e) => {
			//@ts-ignore
			const selected_effect = e.target ? e.target.effect as Exclude<AnyEffect, AudioEffect> : null
			if(selected_effect) {
				this.actions.set_pivot(selected_effect, e.target.pivot.x, e.target.pivot.y)
				const {rect: {position_on_canvas: {x, y}}} = selected_effect
				if(x !== e.global.x || y !== e.global.y) {
					const {x, y} = e.target
					this.actions.set_position_on_canvas(selected_effect, x, y);
					this.actions.set_rotation(selected_effect, e.target.angle)
					this.actions.set_effect_scale(selected_effect, {x: e.target.scale.x, y: e.target.scale.y})
					//@ts-ignore
					e.target.effect = {...e.target.effect,
						rect: {position_on_canvas: {x, y},
						rotation: e.target.angle,
						scaleX: e.target.scale.x,
						scaleY: e.target.scale.y}
					} as Exclude<AnyEffect, AudioEffect>
				}
			}
		})
	}

	async recreate(state: State, media: Media) {
		await media.are_files_ready()
		for(const effect of state.effects) {
			if(effect.kind === "image") {
				const file = media.get(effect.file_hash)?.file
				if(file) {
					await this.managers.imageManager.add_image_effect(effect , file, true)
				}
			}
			else if(effect.kind === "video") {
				const file = media.get(effect.file_hash)?.file
				if(file)
					this.managers.videoManager.add_video_effect(effect, file, true)
			}
			else if(effect.kind === "audio") {
				const file = media.get(effect.file_hash)?.file
				if(file)
					this.managers.audioManager.add_audio_effect(effect, file, true)
			}
			else if(effect.kind === "text") {
				this.managers.textManager.add_text_effect(effect, true)
			}
		}
		for(const filter of state.filters) {
			const effect = state.effects.find(e => e.id === filter.targetEffectId)
			if(effect && (effect.kind === "video" || effect.kind === "image")) {
				this.managers.filtersManager.addFilterToEffect(effect, filter.type, true)
			}
		}
		for(const transition of state.transitions) {
			this.managers.transitionManager.selectTransition(transition, true).apply(omnislate.context.state)
		}
		this.managers.animationManager.refresh(state)
		this.#recreated = true
		this.compose_effects(state.effects, this.timecode)
	}

	update_canvas_objects(state: State) {
		this.app.stage.children.forEach(object => {
			if(!(object instanceof PIXI.Rectangle)) {
				//@ts-ignore
				const object_effect = object.effect as Exclude<AnyEffect, AudioEffect>
				const effect = state.effects.find(effect => effect.id === object_effect?.id) as Exclude<AnyEffect, AudioEffect>
				if(effect) {
					object.x = effect.rect.position_on_canvas.x
					object.y = effect.rect.position_on_canvas.y
					object.angle = effect.rect.rotation
					object.scale.x = effect.rect.scaleX
					object.scale.y = effect.rect.scaleY
					object.pivot.set(effect.rect.pivot.x, effect.rect.pivot.y)
					this.app.render()
				}
			}
		})
	}

	set_canvas_resolution(width: number, height: number) {
		this.app.renderer.resize(width, height)
		this.#guidelineRect.width = width
		this.#guidelineRect.height = height
		this.managers.transitionManager.refreshTransitions()
	}

	set_timebase(value: number) {
		this.timebase = value
	}

	get selectedElement() {
		const selected = omnislate.context.state.selected_effect
		if(selected?.kind === "video") {
			return this.managers.videoManager.get(selected.id)
		} else if(selected?.kind === "image") {
			return this.managers.imageManager.get(selected.id)
		} else if(selected?.kind === "text") {
			return this.managers.textManager.get(selected.id)
		}
		return null
	}


	setOrDiscardActiveObjectOnCanvas(selectedEffect: AnyEffect | undefined, state: State) {
		if(!selectedEffect) {
			if(this.selectedElement) {
				this.app.stage.removeChild(this.selectedElement?.transformer)
			}
			return
		}
		
		const effect = state.effects.find(e => e.id === selectedEffect.id) ?? selectedEffect // getting again to ensure newest props
		const isEffectOnCanvas = get_effect_at_timestamp(effect, state.timecode)

		if (isEffectOnCanvas) {
			if(this.selectedElement) {
				this.app.stage.addChild(this.selectedElement?.transformer)
			}
		}
	}

	set_video_playing = (playing: boolean) => {
		this.#is_playing.value = playing
		this.actions.set_is_playing(playing, {omit: true})
	}

	toggle_video_playing = () => {
		this.#is_playing.value = !this.#is_playing.value
		this.actions.toggle_is_playing({omit: true})
	}

}
