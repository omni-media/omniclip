import {pub, reactor, signal} from "@benev/slate"

import {VideoManager} from "./parts/video-manager.js"
import {TimelineActions} from "../timeline/actions.js"
import {AnyEffect, XTimeline} from "../timeline/types.js"

export class Compositor {

	on_playing = pub()
	
	#is_playing = signal(false)
	#last_time = 0
	#pause_time = 0
	#currently_played_effects: AnyEffect[] = []

	#worker = new Worker(new URL("./worker.js", import.meta.url), {type: "module"});
	#actions: TimelineActions
	readonly canvas = document.createElement("canvas")
	
	VideoManager = new VideoManager()

	constructor(actions: TimelineActions) {
		this.VideoManager.add_video({
			id: "252", kind: "video", src: "/public/bbb_video_avc_frag.mp4",
			start: 0, end: 60000, track: 1, start_at_position: 5000, duration: 60000
		})
		this.#actions = actions
		const offscreen = this.canvas.transferControlToOffscreen();
		this.#worker.postMessage({
			canvas: offscreen,
			type: "canvas"
		}, [offscreen])
		this.#worker.addEventListener("message", (frame: MessageEvent<VideoFrame>) => {
			frame.data.close()
		})
		reactor.reaction(
			() => this.#is_playing.value,
			(is_playing) => {
				this.#pause_time = performance.now() - this.#last_time
				this.#on_playing(is_playing)
				if(is_playing) {
					this.#play_videos()
				} else this.#pause_videos()
			}
		)
	}
	
	#pause_videos() {
		for(const effect of this.#currently_played_effects) {
			if(effect.kind === "video") {
				const video = this.VideoManager.get(effect.id)
				video?.pause()
			}
		}
	}

	async #play_videos() {
		for(const effect of this.#currently_played_effects) {
			if(effect.kind === "video") {
				const video = this.VideoManager.get(effect.id)
				await video?.play()
			}
		}
	}

	#on_playing = (is_playing: boolean) => {
		if(is_playing) {
			const elapsed_time = this.#calculate_elapsed_time()
			this.#actions.increase_timecode(elapsed_time)
			this.on_playing.publish(0)
			this.#draw_effect()
		}
		requestAnimationFrame(() => this.#on_playing(this.#is_playing.value))
	}
	
	#calculate_elapsed_time() {
		const now = performance.now() - this.#pause_time
		const elapsed_time = now - this.#last_time
		this.#last_time = now
		return elapsed_time
	}

	#sort_effects_by_track(effects: AnyEffect[]) {
		// so that effects on first track draw on top of things that are on second track
		const sorted_effects = effects.sort((a, b) => {
			if(a.track < b.track) return 1
				else return -1
		})
		return sorted_effects
	}

	async #draw_effect() {
		const effects_sorted_by_track = this.#sort_effects_by_track(this.#currently_played_effects!)
		if(this.#currently_played_effects) {
			for(const effect of effects_sorted_by_track) {
				if(effect.kind === "video") {
					const video = this.VideoManager.get(effect.id)
					if(video?.paused) {await video.play()}
					try {
						const frame = new VideoFrame(video!)
						this.#worker.postMessage({
							frame,
							type: "frame"
						})
						frame.close()
					} catch(e) {console.log(e)}
				}
				else if(effects_sorted_by_track.length <= 0) {
					this.#worker.postMessage({
						type: "clear-canvas"
					})
				}
				else if(effect.kind === "text") {
					this.#worker.postMessage({
						item: effect,
						type: "text"
					})
				}
			}
		}
	}

	get_effects_relative_to_timecode(state: XTimeline, timecode: number) {
		const effects = state.effects.filter(effect => effect.start_at_position <= timecode && effect.start_at_position + effect.duration >= timecode)
		return effects.length > 0 ? effects : undefined
	}

	set_currently_played_effects(effects: AnyEffect[]) {
		this.#currently_played_effects = effects
	}

	set_video_playing = (playing: boolean) => {
		this.#is_playing.value = playing
		this.#actions.set_is_playing(playing)
	}

	toggle_video_playing = () => {
		this.#is_playing.value = !this.#is_playing.value
		this.#actions.toggle_is_playing()
	}

}
