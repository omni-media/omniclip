import {pub, reactor, signal} from "@benev/slate"

import {TextManager} from "./parts/text-manager.js"
import {VideoManager} from "./parts/video-manager.js"
import {TimelineActions} from "../timeline/actions.js"
import {AnyEffect, XTimeline} from "../timeline/types.js"

export class Compositor {

	on_playing = pub()

	#is_playing = signal(false)
	#last_time = 0
	#pause_time = 0
	currently_played_effects: AnyEffect[] = []

	readonly canvas = document.createElement("canvas")
	readonly ctx = this.canvas.getContext("2d")

	#VideoManager = new VideoManager(this)
	TextManager: TextManager

	constructor(private actions: TimelineActions) {
		this.canvas.width = 1280
		this.canvas.height = 720

		this.TextManager = new TextManager(this, actions)
		this.#VideoManager.add_video({
			id: "252", kind: "video", src: "/public/bbb_video_avc_frag.mp4",
			start: 0, end: 60000, track: 1, start_at_position: 5000, duration: 60000
		})

		reactor.reaction(
			() => this.#is_playing.value,
			(is_playing) => {
				this.#pause_time = performance.now() - this.#last_time
				this.#on_playing(is_playing)
				if(is_playing) {
					this.#VideoManager.play_videos()
				} else this.#VideoManager.pause_videos()
			}
		)
	}

	#on_playing = (is_playing: boolean) => {
		if(is_playing) {
			const elapsed_time = this.#calculate_elapsed_time()
			this.actions.increase_timecode(elapsed_time)
			this.on_playing.publish(0)
			this.draw_effects()
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
		const sorted_effects = [...effects].sort((a, b) => {
			if(a.track < b.track) return 1
				else return -1
		})
		return sorted_effects
	}

	async draw_effects(redraw?: boolean) {
		if(redraw) {this.clear_canvas()}
		const effects_sorted_by_track = this.#sort_effects_by_track(this.currently_played_effects!)
		if(this.currently_played_effects) {
			for(const effect of effects_sorted_by_track) {
				if(effect.kind === "video") {
					const video = this.#VideoManager.get(effect.id)
					if(!redraw && video?.paused) {await video.play()}
					try {
						const frame = new VideoFrame(video!)
						this.#VideoManager.draw_video_frame(frame)
						frame.close()
					} catch(e) {console.log(e)}
				}
				else if(effects_sorted_by_track.length <= 0) {
					this.clear_canvas()
				}
				else if(effect.kind === "text") {
					this.TextManager.draw_text(effect)
				}
			}
		}
	}

	clear_canvas() {
		this.ctx?.clearRect(0, 0, 1280, 720)
	}

	get_effects_relative_to_timecode(state: XTimeline) {
		const timecode = state.timecode
		const effects = state.effects.filter(effect => effect.start_at_position <= timecode && effect.start_at_position + effect.duration >= timecode)
		return effects.length > 0 ? effects : undefined
	}

	set_currently_played_effects(timeline: XTimeline) {
		const effects_relative_to_timecode = this.get_effects_relative_to_timecode(timeline)
		if(effects_relative_to_timecode)
		this.currently_played_effects = effects_relative_to_timecode
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
