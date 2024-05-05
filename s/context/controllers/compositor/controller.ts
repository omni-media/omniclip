import {pub, reactor, signal} from "@benev/slate"
import {Canvas, Rect} from "fabric/dist/fabric.mjs"

import {TextManager} from "./parts/text-manager.js"
import {ImageManager} from "./parts/image-manager.js"
import {AudioManager} from "./parts/audio-manager.js"
import {VideoManager} from "./parts/video-manager.js"
import {TimelineActions} from "../timeline/actions.js"
import {AlignGuidelines} from "./lib/aligning_guidelines.js"
import {compare_arrays} from "../../../utils/compare_arrays.js"
import {AnyEffect, AudioEffect, XTimeline} from "../timeline/types.js"
import {sort_effects_by_track} from "../video-export/utils/sort_effects_by_track.js"

export interface Managers {
	videoManager: VideoManager
	textManager: TextManager
	imageManager: ImageManager
	audioManager: AudioManager
}

export class Compositor {
	on_playing = pub()
	#is_playing = signal(false)
	#last_time = 0
	#pause_time = 0
	timecode = 0
	timebase = 25
	currently_played_effects = new Map<string, AnyEffect>()
	
	canvas_element = document.createElement("canvas")
	canvas: Canvas
	ctx = this.canvas_element.getContext("2d")
	
	managers: Managers

	constructor(private actions: TimelineActions) {
	this.canvas = new Canvas(this.canvas_element, {width: 1920, height: 1080, renderOnAddRemove: true, preserveObjectStacking: true, imageSmoothingEnabled: false})
	this.#init_guidelines()
	this.#on_new_canvas_object_set_handle_styles()
	this.#on_selected_canvas_object()
	this.managers = {
		videoManager: new VideoManager(this, actions),
		textManager: new TextManager(this, actions),
		imageManager: new ImageManager(this, actions),
		audioManager: new AudioManager(this, actions)
	}

		this.#on_playing()
		reactor.reaction(
			() => this.#is_playing.value,
			(is_playing) => {
				if(is_playing) {
					this.managers.videoManager.play_videos()
					this.managers.audioManager.play_audios()
				} else {
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
			this.actions.increase_timecode(elapsed_time)
			this.on_playing.publish(0)
			this.compose_effects([...this.currently_played_effects.values()], this.timecode)
		}
		requestAnimationFrame(this.#on_playing)
	}
	
	#calculate_elapsed_time() {
		const now = performance.now() - this.#pause_time
		const elapsed_time = now - this.#last_time
		this.#last_time = now
		return elapsed_time
	}

	compose_effects(effects: AnyEffect[], timecode: number, exporting?: boolean) {
		this.timecode = timecode
		this.#update_currently_played_effects(effects, timecode, exporting)
		this.canvas.requestRenderAll()
	}

	get_effect_current_time_relative_to_timecode(effect: AnyEffect, timecode: number) {
		const current_time = timecode - effect.start_at_position + effect.start
		return current_time / 1000
	}

	get_effects_relative_to_timecode(effects: AnyEffect[], timecode: number) {
		return effects.filter(effect => effect.start_at_position <= timecode && timecode <= effect.start_at_position + (effect.end - effect.start))
	}

	#update_currently_played_effects(effects: AnyEffect[], timecode: number, exporting?: boolean) {
		const effects_relative_to_timecode = this.get_effects_relative_to_timecode(effects, timecode)
		const {add, remove} = compare_arrays([...this.currently_played_effects.values()], effects_relative_to_timecode)
		this.#update_effects(effects_relative_to_timecode)
		this.#remove_effects_from_canvas(remove, exporting)
		this.#add_effects_to_canvas(add)
		this.#draw_in_correct_order(sort_effects_by_track(effects_relative_to_timecode))
	}

	#update_effects(new_effects: AnyEffect[]) {
		this.currently_played_effects.clear()
		new_effects.forEach(effect => {this.currently_played_effects.set(effect.id, effect)})
	}

	#draw_in_correct_order(effects: AnyEffect[]) {
		const max_track = 4 // lower track means it should draw on top of higher tracks, although moveObjectTo z-index works in reverse
		for(const effect of effects) {
			if(effect.kind === "image") {
				const {element} = this.managers.imageManager.get(effect.id)!
				this.canvas.moveObjectTo(element, max_track - effect.track)
			}
			else if(effect.kind === "video") {
				const {fabric} = this.managers.videoManager.get(effect.id)!
				this.canvas.moveObjectTo(fabric, max_track - effect.track)
			}
			else if(effect.kind === "text") {
				const text = this.managers.textManager.get(effect.id)!
				this.canvas.moveObjectTo(text, max_track - effect.track)
			}
		}
	}

	async set_current_time_of_audio_or_video_and_redraw(redraw?: boolean, timecode?: number) {
		for(const effect of this.currently_played_effects.values()) {
			if(effect.kind === "audio") {
				const {element} = this.managers.audioManager.get(effect.id)!
				if(!redraw && element.paused && this.#is_playing.value) {await element.play()}
				if(redraw && timecode) {
					const current_time = this.get_effect_current_time_relative_to_timecode(effect, timecode)
					element.currentTime = current_time
				}
			}
			if(effect.kind === "video") {
				const {fabric} = this.managers.videoManager.get(effect.id)!
				const element = fabric.getElement() as HTMLVideoElement
				if(!redraw && element.paused && this.#is_playing.value) {await element.play()}
				if(redraw && timecode) {
					const current_time = this.get_effect_current_time_relative_to_timecode(effect, timecode)
					element.currentTime = current_time
				}
			}
		}
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
				const element = this.managers.videoManager.get(effect.id)?.fabric.getElement() as HTMLVideoElement
				if(element) {element.currentTime = effect.start / 1000}
			}
			else if(effect.kind === "text") {
				this.currently_played_effects.set(effect.id, effect)
				this.managers.textManager.add_text_to_canvas(effect)
			}
			else if(effect.kind === "audio") {
				this.currently_played_effects.set(effect.id, effect)
				const element = this.managers.audioManager.get(effect.id)?.element as HTMLAudioElement
				if(element) {element.currentTime = effect.start / 1000}
			}
		}
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

	#init_guidelines() {
		const guideline = new AlignGuidelines({
			canvas: this.canvas,
			aligningOptions: {
				lineColor: "#03a9c1"
			}
		})
		guideline.init()
		// add rect as big as canvas so it acts as guideline for canvas borders
		const rect = new Rect({width: 1920, height: 1080, fill: "transparent", selectable: false, evented: false, rect_type: "guideline"})
		this.canvas.moveObjectTo(rect, 999)
		this.canvas.add(rect)
	}

	#on_new_canvas_object_set_handle_styles() {
		this.canvas.on("object:added", (e) => {
			e.target.set({
				transparentCorners: false,
				borderColor: "#03a9c1",
				cornerColor: "white"
			})
		})
	}

	#on_selected_canvas_object() {
		this.canvas.on("mouse:down", (e) => {
			//@ts-ignore
			const selected_effect = e.target ? e.target.effect as AnyEffect : null
			this.actions.set_selected_effect(selected_effect)
			if(e.target) {this.canvas.setActiveObject(e.target)}
			if(selected_effect?.kind === "text") {this.managers.textManager.set_clicked_effect(selected_effect)}
		})
		this.canvas.on("mouse:up", (e) => {
			//@ts-ignore
			const selected_effect = e.target ? e.target.effect as Exclude<AnyEffect, AudioEffect> : null
			if(selected_effect) {
				const {rect: {position_on_canvas: {x, y}}} = selected_effect
				if(x !== e.target!.left || y !== e.target!.top) {
					this.actions.set_position_on_canvas(selected_effect, e.target!.left, e.target!.top);
					//@ts-ignore
					(e.target.effect as Exclude<AnyEffect, AudioEffect>).rect.position_on_canvas = {x: e.target!.left, y: e.target!.top}
				}
			}
		})
	}

	undo_or_redo(timeline: XTimeline) {
		this.canvas.getObjects().forEach(object => {
			if(!(object instanceof Rect)) {
				//@ts-ignore
				const object_effect = object.effect as Exclude<AnyEffect, AudioEffect>
				const effect = timeline.effects.find(effect => effect.id === object_effect.id)! as Exclude<AnyEffect, AudioEffect>
				if(effect) {
					object.left = effect.rect.position_on_canvas.x
					object.top = effect.rect.position_on_canvas.y
					object.setCoords()
					this.canvas.renderAll()
				}
			}
		})
	}

	set_canvas_resolution(width: number, height: number) {
		this.canvas.setDimensions({width, height})
		const guideline_rect = this.canvas.getObjects().find(object => {
			//@ts-ignore
			if(object.rect_type === "guideline")
				return object
		})
		guideline_rect?.scaleToWidth(width - 1)
		guideline_rect?.scaleToHeight(height - 1)
	}

	set_video_playing = (playing: boolean) => {
		this.#is_playing.value = playing
		this.actions.set_is_playing(playing)
	}

	toggle_video_playing = () => {
		this.#is_playing.value = !this.#is_playing.value
		this.actions.toggle_is_playing()
	}

}
