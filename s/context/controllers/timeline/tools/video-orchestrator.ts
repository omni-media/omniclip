import {pub, reactor, signal} from "@benev/slate"

import {XClip, XTimeline} from "../types.js"
import {TimelineActions} from "../actions.js"

export class VideoOrchestrator {
	on_playing = pub()
	
	#is_playing = signal(false)
	#last_time = 0
	#pause_time = 0
	#currently_played_clips = new Map<string, XClip>()
	#pending_frame: VideoFrame | null = null

	#worker = new Worker(new URL("./worker.js", import.meta.url));
	#actions: TimelineActions

	#video = document.createElement("video")
	readonly canvas = document.createElement("canvas")
	
	constructor(actions: TimelineActions) {
		this.#actions = actions
		const offscreen = this.canvas.transferControlToOffscreen();
		this.#worker.postMessage({
			canvas: offscreen,
			type: "canvas"
		}, [offscreen])
		this.#worker.addEventListener("message", (frame: MessageEvent<VideoFrame>) => {
			frame.data.close()
			this.#pending_frame = null
		})
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
			this.#draw_clip()
		}
		requestAnimationFrame(() => this.#on_playing(this.#is_playing.value))
	}
	
	#calculate_elapsed_time() {
		const now = performance.now() - this.#pause_time
		const elapsed_time = now - this.#last_time
		this.#last_time = now
		return elapsed_time
	}

	#sort_clips_by_track(clips: Map<string, XClip>) {
		// so that clips on first track are drawn on top of things that are on second track
		const sorted_clips = [...clips.values()].sort((a, b) => {
			if(a.track < b.track) return 1
				else return -1
		})
		return sorted_clips
	}

	#draw_clip() {
		const sorted_clips = this.#sort_clips_by_track(this.#currently_played_clips)
		sorted_clips.forEach(clip => {
			if(clip.item.type === "Video") {
				try {
					const frame = new VideoFrame(this.#video)
					this.#worker.postMessage({
						frame,
						type: "frame"
					})
					this.#pending_frame = frame
				} catch(e) {}
			} else if(clip.item.type === "Text") {
				this.#worker.postMessage({
					item: clip.item,
					type: "text"
				})
			}
		})
		if(sorted_clips.length <= 0) {
			this.#worker.postMessage({
				type: "clear-canvas"
			})
		}
	}

	draw_video_frame_at_certain_timecode(timecode: number) {
		this.#video.currentTime = timecode
		this.#draw_clip()
	}

	#create_and_load_video_source() {
		const source = document.createElement("source")
		source.type = "video/mp4"
		source.src=`${new URL("../bbb_video_avc_frag.mp4", import.meta.url)}`
		this.#video.append(source)
		//this.#video.load()
	}

	#unload_video_source() {
		this.#video.append("")
		//this.#video.load()
	}

	#remove_clips(clips: Map<string, XClip>) {
		for(const [id, clip] of this.#currently_played_clips) {
			if(!clips.has(id)) {
				this.#currently_played_clips.delete(id)
				if(clip.item.type === "Video")
					this.#unload_video_source()
			}
		}
	}

	#add_clips(clips: Map<string, XClip>) {
		for(const [id, clip] of clips) {
			if(!this.#currently_played_clips.has(id)) {
				this.#currently_played_clips.set(clip.id, clip)
				if(clip.item.type === "Video")
					this.#create_and_load_video_source()
			}
		}
	}

	#check_for_change_in_currently_played_clips(clips: Map<string, XClip>) {
		this.#add_clips(clips)
		this.#remove_clips(clips)
	}

	set_currently_played_clips(clips: Map<string, XClip> | undefined) {
		if(clips) {
			this.#check_for_change_in_currently_played_clips(clips)
		} else {
			this.#unload_video_source()
			this.#currently_played_clips.clear()
		}
	}

	get_clip_relative_to_timecode(state: XTimeline) {
		const currentTimecode = state.timecode
		const clip = state.clips.find(clip => clip.start_at_position <= currentTimecode && clip.start_at_position + clip.duration >= currentTimecode)
		return clip
	}

	get_clips_relative_to_timecode(state: XTimeline) {
		const currentTimecode = state.timecode
		const clips = state.clips.filter(clip => clip.start_at_position <= currentTimecode && clip.start_at_position + clip.duration >= currentTimecode)
		return clips.length > 0 ? new Map(clips.map(clip => [clip.id, clip])) : undefined
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
