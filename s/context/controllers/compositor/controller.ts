import {Canvas} from "fabric/dist/fabric.mjs"
import {pub, reactor, signal} from "@benev/slate"

import {AnyEffect} from "../timeline/types.js"
import {TextManager} from "./parts/text-manager.js"
import {ImageManager} from "./parts/image-manager.js"
import {AudioManager} from "./parts/audio-manager.js"
import {VideoManager} from "./parts/video-manager.js"
import {TimelineActions} from "../timeline/actions.js"
import {compare_arrays} from "../../../utils/compare_arrays.js"
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
	this.canvas = new Canvas(this.canvas_element, {width: 1280, height: 720, renderOnAddRemove: true, preserveObjectStacking: true})

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

	compose_effects(effects: AnyEffect[], timecode: number) {
		this.timecode = timecode
		this.#update_currently_played_effects(effects, timecode)
		this.canvas.requestRenderAll()
	}

	get_effect_current_time_relative_to_timecode(effect: AnyEffect, timecode: number) {
		const current_time = timecode - effect.start_at_position + effect.start
		return current_time / 1000
	}

	get_effects_relative_to_timecode(effects: AnyEffect[], timecode: number) {
		return effects.filter(effect => effect.start_at_position <= timecode && timecode <= effect.start_at_position + (effect.end - effect.start))
	}

	#update_currently_played_effects(effects: AnyEffect[], timecode: number) {
		const effects_relative_to_timecode = this.get_effects_relative_to_timecode(effects, timecode)
		const {add, remove} = compare_arrays([...this.currently_played_effects.values()], effects_relative_to_timecode)
		this.#remove_effects_from_canvas(remove)
		this.#add_effects_to_canvas(add)
		this.#draw_in_correct_order(sort_effects_by_track([...this.currently_played_effects.values()]))
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
				if(!redraw && element.paused) {await element.play()}
				if(redraw && timecode) {
					const current_time = this.get_effect_current_time_relative_to_timecode(effect, timecode)
					element.currentTime = current_time
				}
			}
			if(effect.kind === "video") {
				const {fabric} = this.managers.videoManager.get(effect.id)!
				const element = fabric.getElement() as HTMLVideoElement
				if(!redraw && element.paused) {await element.play()}
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
			}
			else if(effect.kind === "text") {
				this.currently_played_effects.set(effect.id, effect)
				this.managers.textManager.add_text_to_canvas(effect)
			}
			else if(effect.kind === "audio") {
				this.currently_played_effects.set(effect.id, effect)
			}
		}
	}

	#remove_effects_from_canvas(effects: AnyEffect[]) {
		for(const effect of effects) {
			if(effect.kind === "image") {
				this.currently_played_effects.delete(effect.id)
				this.managers.imageManager.remove_image_from_canvas(effect)
			}
			else if(effect.kind === "video") {
				this.currently_played_effects.delete(effect.id)
				this.managers.videoManager.remove_video_from_canvas(effect)
			}
			else if(effect.kind === "text") {
				this.currently_played_effects.delete(effect.id)
				this.managers.textManager.remove_text_from_canvas(effect)
			}
			else if(effect.kind === "audio") {
				this.currently_played_effects.delete(effect.id)
			}
		}
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
