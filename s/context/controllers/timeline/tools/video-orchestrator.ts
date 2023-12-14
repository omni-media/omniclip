import {pub, reactor, signal} from "@benev/slate"

import {XTimeline} from "../types.js"
import {TimelineActions} from "../actions.js"
import {Media} from "../../../../components/omni-media/types.js"

export class VideoOrchestrator {
	on_playing = pub()
	
	#is_playing = signal(false)
	#last_time = 0
	#pause_time = 0
	#currently_played_media_sources: Media | undefined = undefined

	#actions: TimelineActions

	#video = document.createElement("video")
	readonly canvas = document.createElement("canvas")
	#canvasctx = this.canvas.getContext("2d")
	
	constructor(actions: TimelineActions) {
		this.#actions = actions
		this.#video.addEventListener("loadeddata", this.#init_canvas)
		reactor.reaction(
			() => this.#is_playing.value,
			(is_playing) => {
				this.#pause_time = performance.now() - this.#last_time
				this.#on_playing(is_playing)
				if(is_playing) {this.#video.play()}
				else this.#video.pause()
			}
		)
	}

	#on_playing = (is_playing: boolean) => {
		if(is_playing) {
			const elapsed_time = this.#calculate_elapsed_time()
			this.#actions.increase_timecode(elapsed_time)
			this.on_playing.publish(0)
			if(this.#currently_played_media_sources) {
				this.#draw_video_frame()
			}
		}
		requestAnimationFrame(() => this.#on_playing(this.#is_playing.value))
	}
	
	#calculate_elapsed_time() {
		const now = performance.now() - this.#pause_time
		const elapsed_time = now - this.#last_time
		this.#last_time = now
		return elapsed_time
	}

	#init_canvas = () => {
		this.canvas.width = this.#video.videoWidth
		this.canvas.height = this.#video.videoHeight
		this.#draw_video_frame()
	}

	#draw_video_frame() {
		this.#canvasctx!.drawImage(
			this.#video,
			0,
			0,
			this.canvas.width,
			this.canvas.height
		)
	}

	draw_video_frame_at_certain_timecode(timecode: number) {
		this.#video.currentTime = timecode
		this.#draw_video_frame()
	}

	#create_and_load_new_source() {
		const source = document.createElement("source")
		source.type = "video/mp4"
		source.src=`${new URL("../bbb_video_avc_frag.mp4", import.meta.url)}`
		this.#video.append(source)
	}

	#clear_and_unload_video_sources() {
		this.#video.append("")
		this.#video.load()
		this.#canvasctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	set_video_source(source: Media | undefined) {
		if(source && source.source !== this.#currently_played_media_sources?.source) {
			this.#currently_played_media_sources = source
			this.#create_and_load_new_source()
			this.#video.onloadeddata = this.#video.play
		} else if(!source && source !== this.#currently_played_media_sources){
			this.#currently_played_media_sources = source
			this.#clear_and_unload_video_sources()
		}
	}

	get_clip_relative_to_timecode(state: XTimeline) {
		const currentTimecode = state.timecode
		const clip = state.clips.find(clip => clip.start_at_position <= currentTimecode && clip.start_at_position + clip.duration >= currentTimecode)
		return clip
	}

	get_clip_current_time_relative_to_timecode(state: XTimeline) {
		const clip = this.get_clip_relative_to_timecode(state)
		if(clip) {
			const current_time = state.timecode - clip?.start_at_position
			return current_time / 1000
		}
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
