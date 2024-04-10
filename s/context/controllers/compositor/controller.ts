import {pub, reactor, signal} from "@benev/slate"

import {TextManager} from "./parts/text-manager.js"
import {ImageManager} from "./parts/image-manager.js"
import {AudioManager} from "./parts/audio-manager.js"
import {VideoManager} from "./parts/video-manager.js"
import {TimelineActions} from "../timeline/actions.js"
import {EffectManager} from "./parts/effect-manager.js"
import {EffectResizer} from "./parts/effect-resizer.js"
import {AnyEffect, XTimeline} from "../timeline/types.js"

export class Compositor {

	on_playing = pub()

	#is_playing = signal(false)
	#last_time = 0
	#pause_time = 0
	currently_played_effects: AnyEffect[] = []

	readonly canvas = document.createElement("canvas")
	readonly ctx = this.canvas.getContext("2d")

	VideoManager = new VideoManager(this)
	TextManager: TextManager
	ImageManager = new ImageManager(this)
	EffectManager: EffectManager
	AudioManager = new AudioManager(this)
	EffectResizer: EffectResizer

	constructor(private actions: TimelineActions) {
		this.canvas.width = 1280
		this.canvas.height = 720
		this.TextManager = new TextManager(this, actions)
		this.EffectManager = new EffectManager(this, actions)
		this.EffectResizer = new EffectResizer(this, actions)

		this.#on_playing()
		reactor.reaction(
			() => this.#is_playing.value,
			(is_playing) => {
				if(is_playing) {
					this.VideoManager.play_videos()
					this.AudioManager.play_audios()
				} else {
					this.VideoManager.pause_videos()
					this.AudioManager.pause_audios()
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
			this.draw_effects()
		}
		requestAnimationFrame(this.#on_playing)
	}
	
	#calculate_elapsed_time() {
		const now = performance.now() - this.#pause_time
		const elapsed_time = now - this.#last_time
		this.#last_time = now
		return elapsed_time
	}

	#sort_effects_by_track(effects: AnyEffect[]) {
		// so that effects on first track draw on top of things that are on second track
		const sorted_effects = [...effects].sort((a, b) => {
			if(a.track < b.track) return 1
				else return -1
		})
		return sorted_effects
	}

	async draw_effects(redraw?: boolean, timecode?: number) {
		this.clear_canvas()
		const effects_sorted_by_track = this.#sort_effects_by_track(this.currently_played_effects!)
		if(this.currently_played_effects) {
			for(const effect of effects_sorted_by_track) {
				if(effect.kind === "video") {
					const {element} = this.VideoManager.get(effect.id)!
					if(!redraw && element.paused) {await element.play()}
					if(redraw && timecode) {
						const current_time = this.get_effect_current_time_relative_to_timecode(effect, timecode)
						element.currentTime = current_time
					}
					try {
						this.VideoManager.draw_video_frame(effect)
					} catch(e) {console.log(e)}
				}
				else if(effect.kind === "text") {
					this.TextManager.draw_text(effect)
				}
				else if(effect.kind === "image") {
					this.ImageManager.draw_image_frame(effect)
				}
				else if(effect.kind === "audio") {
					const {element} = this.AudioManager.get(effect.id)!
					if(!redraw && element.paused) {await element.play()}
					if(redraw && timecode) {
						const current_time = this.get_effect_current_time_relative_to_timecode(effect, timecode)
						element.currentTime = current_time
					}
				}
			}
		}
		if(this.currently_played_effects.length === 0) {
			this.clear_canvas()
		}
	}

	clear_canvas() {
		this.ctx?.clearRect(0, 0, 1280, 720)
	}

	get_effect_current_time_relative_to_timecode(effect: AnyEffect, timecode: number) {
		const current_time = timecode - effect.start_at_position + effect.start
		return current_time / 1000
	}

	get_effects_relative_to_timecode(state: XTimeline) {
		const timecode = state.timecode
		const effects = state.effects.filter(effect => effect.start_at_position <= timecode && timecode <= effect.start_at_position + (effect.end - effect.start))
		return effects.length > 0 ? effects : undefined
	}

	update_currently_played_effects(timeline: XTimeline) {
		const effects_relative_to_timecode = this.get_effects_relative_to_timecode(timeline)
		if(effects_relative_to_timecode) {
			this.currently_played_effects = effects_relative_to_timecode
		} else this.currently_played_effects = []
	}

	update_currently_played_effect(effect: AnyEffect) {
		const updated = this.currently_played_effects.map(e => e.id === effect.id ? e = effect : e) as AnyEffect[]
		const sorted = this.#sort_effects_by_track(updated)
		this.currently_played_effects = sorted
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
